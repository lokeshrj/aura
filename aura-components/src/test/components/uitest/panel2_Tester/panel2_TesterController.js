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
	init : function(cmp, event, helper) {
		helper.createHeaderFooterInstance(cmp);
	},
	
	createPanel : function(cmp, event, helper) {
		var config = {};
		var type = cmp.get("v.panelType");
		var panelTitle = cmp.get("v.title")
		
		// set attributes for specific types of panels
		switch(type) {
			case "modal": {
				if (panelTitle !== "") {
					config["title"] = panelTitle + " -- Modal";
				}
				break;
			} case "panel": {
				if (panelTitle !== "") {
					config["title"] = cmp.get("v.title") + " -- Dialog";
				}
				config["direction"] = cmp.get("v.direction");
				config["showPointer"] = $A.util.getBooleanValue(cmp.get("v.showPointer"));
				config["referenceElementSelector"] = cmp.get("v.referenceElementSelector");
				
				var useReferenceElement = $A.util.getBooleanValue(cmp.get("v.useReferenceElement"));
				var referenceElement = cmp.get("v.referenceElement");
				if (useReferenceElement && referenceElement.length > 0) {
					config["referenceElement"] = referenceElement;
				}
				break;
			}			
		}
		
		// set common attributes for panel
		config["titleDisplay"] = $A.util.getBooleanValue(cmp.get("v.titleDisplay"));
		config["startOfDialogLabel"] = cmp.get("v.startOfDialogLabel");
		config["closeOnClickOut"] = $A.util.getBooleanValue(cmp.get("v.closeOnClickOut"));
		config["showCloseButton"] = $A.util.getBooleanValue(cmp.get("v.showCloseButton"));
		config["closeDialogLabel"] = cmp.get("v.closeDialogLabel");
		config["useTransition"] = $A.util.getBooleanValue(cmp.get("v.useTransition"));
		config["animation"] = cmp.get("v.animation");
		config["autoFocus"] = $A.util.getBooleanValue(cmp.get("v.autoFocus"));
		config["class"] = cmp.get("v.class");
		config["flavor"] = cmp.get("v.flavor");
		//provide an option not to destroy the panel when closeOnClickOut is set to true.
		//Bug: W-2619406
		var CustomizeCloseAction = $A.util.getBooleanValue(cmp.get("v.customizeCloseAction"));
		if(CustomizeCloseAction){
			config["closeAction"] = function(cmp, reason){
										cmp.set("v.closeActionCalled", "CloseActionCustomMethodCalled when " + reason);
									}
	 	}
		helper.createHeaderFooterInstance(cmp, true);
		var useHeader = $A.util.getBooleanValue(cmp.get("v.useHeader"));
		var panelHeader = cmp.get("v.panelHeader");
		if (useHeader && panelHeader.length > 0) {
			config["header"] = panelHeader; 
		}
		
		var useFooter = $A.util.getBooleanValue(cmp.get("v.useFooter"));
		var panelFooter = cmp.get("v.panelFooter");
		if (useFooter && panelFooter.length > 0) {
			config["footer"] = panelFooter; 
		}
		
		// set panel's body
		var makeScrollable = cmp.get("v.makeScrollable");
		var panelBody;
		if (makeScrollable) {
			// body of panel is just a bunch of text
			panelBody = $A.newCmp({
	    		componentDef: "markup://ui:outputText",
	    		attributes: {
	    			values: {
	    				value: "Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com Salesforce.com "
	    			}
	    		}
			});
		}else if (cmp.get("v.nonScrollable")) {
				// body of panel is just a bunch of text
				panelBody = $A.newCmp({
		    		componentDef: "markup://ui:outputText",
		    		attributes: {
		    			values: {
		    				value: "Salesforce.com Salesforce.com"
		    			}
		    		}
				});
		} else {
			// body of panel is more interesting
			panelBody = $A.newCmp([{
	    		componentDef: "markup://ui:outputText",
	    		attributes: {
	    			values: {
	    				value: "New panel body"
	    			}
	    		}
			},{
					componentDef: "markup://uitest:panel2_Tester",
			}]);
		}
		config["body"] = panelBody;
		// create panel
		$A.get("e.ui:createPanel").setParams({
			panelType: type,
			visible: cmp.get("v.isVisible"),
			panelConfig : config,
			onCreate : function(panel){
				cmp._panel = panel;
				cmp.find("IdCreated").set("v.value", panel.getGlobalId());
			},
			onDestroy : function(panelId){
				cmp.find("IdDestroyed").set("v.value", panelId);
			}
		}).fire();
	}

})