/*
 * Copyright (C) 2013 salesforce.com, inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
({
    MonthLabels: [{
        fullName: "January",
        shortName: "Jan"
    }, {
        fullName: "February",
        shortName: "Feb"
    }, {
        fullName: "March",
        shortName: "Mar"
    }, {
        fullName: "April",
        shortName: "Apr"
    }, {
        fullName: "May",
        shortName: "May"
    }, {
        fullName: "June",
        shortName: "Jun"
    }, {
        fullName: "July",
        shortName: "Jul"
    }, {
        fullName: "August",
        shortName: "Aug"
    }, {
        fullName: "September",
        shortName: "Sep"
    }, {
        fullName: "October",
        shortName: "Oct"
    }, {
        fullName: "November",
        shortName: "Nov"
    }, {
        fullName: "December",
        shortName: "Dec"
    }],

    attachToDocumentBody: function(component) {
        var body = document.getElementsByTagName("body")[0];
        var elem = component.getElement();
        body.appendChild(elem);
    },

    focusDate: function(component) {
        var grid = component.find("grid");
        var e = grid.get("e.focus");
        e.fire();
    },

    getOnClickEndFunction : function(component) {
        if ($A.util.isUndefined(component._onClickEndFunc)) {
            var helper = this;
            var f = function(event) {
                // ignore gestures/swipes; only run the click handler if it's a click or tap
                var clickEndEvent;

                if (helper.getOnClickEventProp("isTouchDevice")) {
                    var touchIdFound = false;
                    for (var i = 0; i < event.changedTouches.length; i++) {
                        clickEndEvent = event.changedTouches[i];
                        if (clickEndEvent.identifier === component._onStartId) {
                            touchIdFound = true;
                            break;
                        }
                    }

                    if (helper.getOnClickEventProp("isTouchDevice") && !touchIdFound) {
                        return;
                    }
                } else {
                    clickEndEvent = event;
                }

                var startX = component._onStartX, startY = component._onStartY;
                var endX = clickEndEvent.clientX, endY = clickEndEvent.clientY;

                if (Math.abs(endX - startX) > 0 || Math.abs(endY - startY) > 0) {
                    return;
                }

                if (!helper.isElementInComponent(component, event.target)) {
                    // Hide the component
                    component.set("v.visible", false);

                    //Since we are no longer going into the rerender function, updateGlobalEventListeners does not get called and the listeners will never get turned off
                    var concreteCmp = component.getConcreteComponent();
                    concreteCmp._clickStart.setEnabled(false);
                    concreteCmp._clickEnd.setEnabled(false);

                    var divCmp = component.find("datePicker");
                    if (divCmp) {
                        var elem = divCmp.getElement();
                        $A.util.removeClass(elem, "visible");
                    }
                }
            };
            component._onClickEndFunc = f;
        }
        return component._onClickEndFunc;
    },

    getOnClickEventProp: function(prop) {
        // create the cache
        if ($A.util.isUndefined(this.getOnClickEventProp.cache)) {
            this.getOnClickEventProp.cache = {};
        }

        // check the cache
        var cached = this.getOnClickEventProp.cache[prop];
        if (!$A.util.isUndefined(cached)) {
            return cached;
        }

        // fill the cache
        this.getOnClickEventProp.cache["isTouchDevice"] = $A.util.supportsTouchEvents();
        if (this.getOnClickEventProp.cache["isTouchDevice"]) {
        	if (window["navigator"]["pointerEnabled"]) {
        		this.getOnClickEventProp.cache["onClickStartEvent"] = "pointerdown";
                this.getOnClickEventProp.cache["onClickEndEvent"] = "pointerup";
            } else if (window["navigator"]["msPointerEnabled"]) {
                this.getOnClickEventProp.cache["onClickStartEvent"] = "MSPointerDown";
                this.getOnClickEventProp.cache["onClickEndEvent"] = "MSPointerUp";
            } else {
                this.getOnClickEventProp.cache["onClickStartEvent"] = "touchstart";
                this.getOnClickEventProp.cache["onClickEndEvent"] = "touchend";
            }
        } else {
            this.getOnClickEventProp.cache["onClickStartEvent"] = "mousedown";
            this.getOnClickEventProp.cache["onClickEndEvent"] = "mouseup";
        }
        return this.getOnClickEventProp.cache[prop];
    },

    getOnClickStartFunction: function(component) {
        if ($A.util.isUndefined(component._onClickStartFunc)) {
            var helper = this;
            var f = function(event) {
                if (helper.getOnClickEventProp("isTouchDevice")) {
                    var touch = event.changedTouches[0];
                    // record the ID to ensure it's the same finger on a multi-touch device
                    component._onStartId = touch.identifier;
                    component._onStartX = touch.clientX;
                    component._onStartY = touch.clientY;
                } else {
                    component._onStartX = event.clientX;
                    component._onStartY = event.clientY;
                }
            };
            component._onClickStartFunc = f;
        }
        return component._onClickStartFunc;
    },

    goToNextYear: function(component) {
        var grid = component.find("grid");
        var e = grid.get("e.updateCalendar");
        if (e) {
            e.setParams({monthChange: 0, yearChange: 1, setFocus: false});
            e.fire();
        }
    },

    goToPrevYear: function(component) {
	    var grid = component.find("grid");
	    var e = grid.get("e.updateCalendar");
	    if (e) {
	        e.setParams({monthChange: 0, yearChange: -1, setFocus: false});
	        e.fire();
	    }
	},

    handleESCKey: function(component, event) {
        var keyCode = event.keyCode;
        if (keyCode == 27) { // Esc key is pressed
            component.setValue("{!v.visible}", false);
        }
    },

    isElementInComponent : function(component, targetElem) {
        var componentElements = component.getElements();

        //go up the chain until it hits either a sibling or the root
        var currentNode = targetElem;

        do {
            for (var index = 0; index < componentElements.length ; index++) {
                if (componentElements[index] === currentNode) { return true; }
            }

            currentNode = currentNode.parentNode;
        } while(currentNode);

        return false;
    },

    localizeToday: function(component) {
        var todayCmp = component.find("today");
        if (!todayCmp) {
            return;
        }
        var todayLabel = $A.get("$Locale.labelForToday");
        if (!todayLabel) {
            todayLabel = "Today";
        }
        todayCmp.set("v.label", todayLabel);
    },

    getNormalizedLang: function(component) {
        var ret = 'en';
        var lang = [];
        var token = "";
        var langLocale = $A.get("$Locale.langLocale");
        //var langLocale = component.get("m.langLocale");
        if (langLocale) {
            var index = langLocale.indexOf("_");
            while (index > 0) {
                token = langLocale.substring(0, index);
                langLocale = langLocale.substring(index + 1);
                lang.push(token.toLowerCase());
                index = langLocale.indexOf("_");
            }
            langLocale = langLocale.substring(index + 1);
            if (!$A.util.isEmpty(langLocale)) {
                lang.push(langLocale.toLowerCase());
            }
        } else {
            lang.push("en");
        }

        if (lang[0] === "zh") {
            ret = lang[0] + "-" + lang[1];
        } else {
            ret = lang[0];
        }
        return ret;
    },

    handleWinResize: function(component, e) {
        if (!component || !component.isValid()) {
            return;
        }
        var elem = component.getElement();
        if (elem) {
            var origWinHeight = component._windowSize.height;
            var currWinHeight = $A.util.getWindowSize().height;
            var elemRect = elem.getBoundingClientRect();
            if (currWinHeight < origWinHeight - 20) { // soft keyboard up
                elem.style.top = currWinHeight - origWinHeight + "px";
            } else {
                elem.style.top = 0 + "px";
            }
        }
    },

    position: function(component) {
        var divCmp = component.find("datePicker");
        var elem = divCmp ? divCmp.getElement() : null;
        var visible = component.get("v.visible");
        var viewPort = $A.util.getWindowSize();
        var referenceElem = component.getConcreteComponent().get("v.referenceElement");

        if (elem && visible) {
            var isPhone = $A.get("$Browser.isPhone");

            if (isPhone === true) {
                this.attachToDocumentBody(component);
                var scrollerDivCmp = component.find("scroller");
                var scrollerElem = scrollerDivCmp ? scrollerDivCmp.getElement() : null;
                if (scrollerElem) { // Set scroller div height to make it scrollable.
                    var isAndroid = $A.get("$Browser.isAndroid");
                    if (isAndroid == true) {
                        scrollerElem.style.height = component._windowSize.height + "px";
                    } else {
                        scrollerElem.style.height = viewPort.height + "px";
                    }
                }

            // Scoping this to desktop to prevent regressions
            } else if (!$A.util.isUndefinedOrNull(referenceElem) && $A.get("$Browser.formFactor") == "DESKTOP") {
                component.positionConstraint = this.lib.panelPositioning.createRelationship({
                    element:elem,
                    target:referenceElem,
                    align: 'left top',
                    targetAlign: 'left bottom'
                });
                this.lib.panelPositioning.reposition();
                                    
                //attaching to the body causes the date to lose focus so we need to add the focus back
                this.focusDate(component);
            } else {
                if (!$A.util.isUndefinedOrNull(referenceElem)) {
                    $A.util.attachToDocumentBody(component.getElement());
                    var elemRect = elem.getBoundingClientRect();
                    var referenceElemRect = referenceElem.getBoundingClientRect();
                    var viewPort = $A.util.getWindowSize();

                    // Vertical alignment
                    // getBoundingClientRect method does not return height and width in IE7 and Ie8
                    var height = typeof elemRect.height != 'undefined' ? elemRect.height : elemRect.bottom - elemRect.top;
                    var scrollY = document.documentElement.scrollTop;
                    if ((viewPort.height - referenceElemRect.bottom) < height) { // no enough space below
                        if (referenceElemRect.top < height) { // no enough space above either. Put it in the middle then
                            elem.style.top = scrollY + "px";
                        } else { // put it above
                            elem.style.top = (referenceElemRect.top - height) + scrollY + "px";
                        }
                    } else { // put it below
                        elem.style.top = referenceElemRect.bottom + scrollY + "px";
                    }

                    // Horizontal alignment
                    // getBoundingClientRect method does not return height and width in IE7 and Ie8
                    var width = typeof elemRect.width != 'undefined' ? elemRect.width : elemRect.right - elemRect.left;
                    if (referenceElemRect.right < width) {
                        elem.style.left = document.documentElement.scrollLeft + "px";
                    } else {
                        elem.style.left = referenceElemRect.right - width + document.documentElement.scrollLeft + "px";
                    }

                    //attaching to the body causes the date to lose focus so we need to add the focus back
                    this.focusDate(component);
                } else {
                    var elemRect = elem.getBoundingClientRect();

                    if (elemRect.bottom > viewPort.height) { // no enough space below
                        elem.style.top = 0 - (elemRect.bottom - viewPort.height) + "px"; // Move it up a bit
                    }
                    else {
                        elem.style.top = "auto";
                    }
                }
            }
        }
        },

    refreshYearSelection: function(component) {
        var minY = component.get("v.minYear");
        if (!minY) {
            minY = (new Date()).getFullYear() - 100;
        }
        var maxY = component.get("v.maxYear");
        if (!maxY) {
            maxY = (new Date()).getFullYear() + 30;
        }
        var yearTitleCmp = component.find("yearTitle");
        var selectElem = yearTitleCmp ? yearTitleCmp.getElement() : null;
        if (selectElem) {
        	selectElem.setAttribute("id", yearTitleCmp.getGlobalId());
            for (var i = minY; i <= maxY; i++) {
                selectElem.options[selectElem.options.length] = new Option(i+"", i+"");
            }
        }
    },

    setGridInitialValue: function(component) {
        var initialDate = new Date();
        var value = component.get("v.value");
        if (!$A.util.isUndefinedOrNull(value) && !$A.util.isEmpty(value)) {
            var d = moment(value, "YYYY-MM-DD");
            initialDate = d.toDate();
        }
        var grid = component.find("grid");
        if (grid) {
            grid.set("v.selectedDate", initialDate.getFullYear() + "-" + (initialDate.getMonth() + 1) + "-" + initialDate.getDate());
            grid.set("v.date", initialDate.getDate());
            grid.set("v.month", initialDate.getMonth());
            grid.set("v.year", initialDate.getFullYear());
        }

        // set initial value to time picker if hasTime is true
        var hasTime = $A.util.getBooleanValue(component.get("v.hasTime"));
        if (hasTime) {
            var timePickerCmp = component.find("time");
            if (timePickerCmp) {
                timePickerCmp.set("v.hours", component.get("v.hours"));
                timePickerCmp.set("v.is24HourFormat", component.get("v.is24HourFormat"));
                timePickerCmp.set("v.minutes", component.get("v.minutes"));
            }
        }
    },
    
    setTitleTag: function(component) {
    	var headingLevel = component.get("v.titleHeadingLevel");
    	if ($A.util.isEmpty(headingLevel)) {
    		return;
    	}
        var calTitle = component.find("calTitle");
        if (calTitle) {
        	calTitle.set("v.tag", headingLevel);
        }
    },

    updateGlobalEventListeners: function(component) {
        var concreteCmp = component.getConcreteComponent();
        var visible = concreteCmp.get("v.visible");
        if (!concreteCmp._clickStart) {
            concreteCmp._clickStart = concreteCmp.addDocumentLevelHandler(this.getOnClickEventProp("onClickStartEvent"),
                this.getOnClickStartFunction(component), visible);
            concreteCmp._clickEnd = concreteCmp.addDocumentLevelHandler(this.getOnClickEventProp("onClickEndEvent"),
                this.getOnClickEndFunction(component), visible);
        } else {
            concreteCmp._clickStart.setEnabled(visible);
            concreteCmp._clickEnd.setEnabled(visible);
        }
    },

    updateMonthYear: function(component, value) {
        var isDesktop = $A.get("$Browser.formFactor") == "DESKTOP";
        if (!isDesktop) { // mobile
            this.updateMobileMonthYear(component, value);
            return;
        }
        var grid = component.find("grid");
        if (grid) {
            var m = grid.get("v.month");
            var y = grid.get("v.year");
            var titleCmp = component.find("calTitle");
            if (titleCmp) {
                var elem = titleCmp.getElement();
                if (elem) {
                    var monthLabels = $A.get("$Locale.nameOfMonths");
                    var title = monthLabels ? monthLabels[m].fullName + " " + y : this.MonthLabels[m].fullName + " " + y;
                    elem.textContent = elem.innerText = title;
                }
            }
            var yearTitleCmp = component.find("yearTitle");
            var selectElem = yearTitleCmp ? yearTitleCmp.getElement() : null;
            if (selectElem) {
                selectElem.value = y + "";
            }
        }
    },

    updateMobileMonthYear: function(component, value) {
        var grid = component.find("grid");
        if (grid) {
            var m = grid.get("v.month");
            var y = grid.get("v.year");
            var monthTitleCmp = component.find("monthTitle");
            if (monthTitleCmp) {
                var monthLabels = $A.get("$Locale.nameOfMonths");
                monthTitleCmp.set("v.value", monthLabels ? monthLabels[m].fullName : this.MonthLabels[m].fullName);
            }
            var yearTitleCmp = component.find("yearTitle");
            var selectElem = yearTitleCmp ? yearTitleCmp.getElement() : null;
            if (selectElem) {
                selectElem.value = y + "";
            }
        }
    },

    yearChange: function(component) {
        var grid = component.find("grid");
        var yearCmp = component.find("yearTitle");
        if (grid && yearCmp) {
            var e = grid.get("e.updateCalendar");
            if (e) {
                var y = parseInt(grid.get("v.year"),10);
                var selectedYear = parseInt(yearCmp.getElement().value,10);
                e.setParams({monthChange: 0, yearChange: selectedYear - y, setFocus: false});
                e.fire();
            }
        }
    }
})
