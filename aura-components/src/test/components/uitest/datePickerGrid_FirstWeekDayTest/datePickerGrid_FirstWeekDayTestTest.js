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
    testWeekdayVal1_Sunday: {
        test: function(cmp) {
            this.updateNameOfWeekDays(
                cmp,
                1,//mocked value of first date of week (1 = SUN ---- 7 = SUN)
                ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] //expected dates of week
            );
        }
    },
    testWeekdayVal2_Monday: {
        test: function(cmp) {
            this.updateNameOfWeekDays(
                cmp,
                2,//mocked value of first date of week (1 = SUN ---- 7 = SUN)
                ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] //expected dates of week
            );
        }
    },
    testWeekdayVal3_Tuesday: {
        test: function(cmp) {
            this.updateNameOfWeekDays(
                cmp,
                3,//mocked value of first date of week (1 = SUN ---- 7 = SUN)
                ['TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN', 'MON'] //expected dates of week
            );
        }
    },
    testWeekdayVal4_Wednesday: {
        test: function(cmp) {
            this.updateNameOfWeekDays(
                cmp,
                4,//mocked value of first date of week (1 = SUN ---- 7 = SUN)
                ['WED', 'THU', 'FRI', 'SAT', 'SUN', 'MON', 'TUE'] //expected dates of week
            );
        }
    },
    testWeekdayVal5_Thusrday: {
        test: function(cmp) {
            this.updateNameOfWeekDays(
                cmp,
                5,//mocked value of first date of week (1 = SUN ---- 7 = SUN)
                ['THU', 'FRI', 'SAT', 'SUN', 'MON', 'TUE', 'WED'] //expected dates of week
            );
        }
    },
    testWeekdayVal6_Friday: {
        test: function(cmp) {
            this.updateNameOfWeekDays(
                cmp,
                6,//mocked value of first date of week (1 = SUN ---- 7 = SUN)
                ['FRI', 'SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU'] //expected dates of week
            );
        }
    },
    testWeekdayVal7_Saturday: {
        test: function(cmp) {
            this.updateNameOfWeekDays(
                cmp,
                7,//mocked value of first date of week (1 = SUN ---- 7 = SUN)
                ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'] //expected dates of week
            );
        }
    },



    //helper
    _getNamesOfWeekDays: function(cmp) {
        return cmp.get('v._namesOfWeekdays');
    },
    _serializeShortNameOfWeekdays: function(weekDaysArray) {
        var arr = [];
        for (var i = 0; i < weekDaysArray.length; i++) {
            arr.push(
                $A.util.trim( weekDaysArray[i].shortName)
            );
        }
        return arr.join(',');
    },
    // mock $Locale.firstDayOfWeek for the purpose of testing first date of week
    // value range from 1 to 7 (1 = SUN ---- 7 = SUN)
    _mockFirstDayOfWeek: function(valFirstDayOfWeek) {
        // TODO: find a better way to mock first day of week. According to John,
        // This is a very hacky way of mocking read only locale
        $A.get("$Locale").firstDayOfWeek = valFirstDayOfWeek;


        //verify if the mock value of first date of week match
        $A.test.assertEquals(
            valFirstDayOfWeek + '',
            $A.get('$Locale.firstDayOfWeek') + '',
            'Mocked $Locale.firstDayOfWeek should be present'
        );
    },
    verifyDateOfWeeks: function(actualWeekdaysArray, expectedWeekdaysStrArray) {
        //7 days in a week
        $A.test.assertEquals(7, actualWeekdaysArray.length, "There must be 7 days in a week (Attributes)");

        //check order in weekdays in component levels
        $A.test.assertEquals(
            expectedWeekdaysStrArray.join(','),
            this._serializeShortNameOfWeekdays(actualWeekdaysArray),
            "Date of week must match (from attributes)"
        );

        //check order in weekdays in the dom
        $A.test.addWaitForWithFailureMessage(
            expectedWeekdaysStrArray.join(','),
            function(){
                var elWeekDaysHeader = $A.test.select('th.dayOfWeek');
                var weekdayStrFromDom = [];
                for(var i = 0; i < elWeekDaysHeader.length; i++){
                    weekdayStrFromDom.push(
                        $A.util.trim(
                            $A.util.getText( elWeekDaysHeader[i] )
                        )
                    );
                }
                return weekdayStrFromDom.join(',');
            },
            "Date of week must match (from dom)"
        );
    },

    updateNameOfWeekDays: function(cmp, mockedFirstWeekday, expectedWeekDays) {
        //mock first date of week
        this._mockFirstDayOfWeek(mockedFirstWeekday);

        //trigger grid update name of weekdays
        var grid = cmp.find('grid');
        var helper = grid.getDef().getHelper();
        helper.updateNameOfWeekDays(cmp);
        helper.updateNameOfWeekDays(grid);
        helper.renderGrid(grid);

        //get weekdays array object
        var weekdaysArray = this._getNamesOfWeekDays(cmp);

        // verify date of weeks
        this.verifyDateOfWeeks(
            weekdaysArray,
            expectedWeekDays
        );

        //update attributes for viewing purposes
        cmp.set(
            'v.namesOfWeekdaysStr',
            this._serializeShortNameOfWeekdays(weekdaysArray)
        );
        cmp.set(
            'v.firstDayOfWeek',
            mockedFirstWeekday
        );
        cmp.set(
            'v.totalWeekdays',
            weekdaysArray ? weekdaysArray.length : 0
        )
    }
});