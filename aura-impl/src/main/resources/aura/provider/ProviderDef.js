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
/*jslint sub : true */
/**
 * @description Creates a ProviderDef instance with the provide method. An error is displayed if the provider method is not found.
 * @constructor
 * @protected
 * @export
 */
function ProviderDef(config){
    this.provideMethod = aura.util.json.decodeString(config["provide"]);
    $A.assert(this.provideMethod, "Provide method not found");
}

/**
 * Runs the provide method on the component and returns the component definition.
 * Throws an error if the provide method is not found.
 * @param {Component} component
 * @param {Boolean} localCreation
 * @param {Function} callback
 */
ProviderDef.prototype.provide = function(component, localCreation, callback) {
    var provideMethod = this.provideMethod;

    var providedConfig = provideMethod(component, localCreation);

    if (!providedConfig || $A.util.isString(providedConfig)) {
        providedConfig = {
            'componentDef': providedConfig
        };
    }

    if (providedConfig['componentDef']) {
        var def = $A.componentService.getDef(providedConfig['componentDef']);
        // set available component def
        providedConfig['componentDef'] = def;
    } else {
        // no component def provided so set to current component
        providedConfig['componentDef'] = component.getDef();
    }
    callback(providedConfig['componentDef'], providedConfig['attributes']);
};

Aura.Provider.ProviderDef = ProviderDef;
