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
package org.auraframework.components.test;

import junit.framework.TestSuite;

import org.auraframework.util.ServiceLocator;
import org.auraframework.util.test.util.TestInventory;
import org.auraframework.util.test.util.TestInventory.Type;

public class AuraComponentsWebDriverTestSuite {
    public static TestSuite suite() throws Exception {
        TestInventory inventory = ServiceLocator.get().get(TestInventory.class, "auraComponentsTestInventory");
        TestSuite suite = inventory.getTestSuite(Type.WEB);
        suite.setName("aura-components webdriver tests");
        return suite;
    }

}
