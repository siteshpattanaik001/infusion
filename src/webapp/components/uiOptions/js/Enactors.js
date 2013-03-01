/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// Declare dependencies
/*global fluid_1_5:true, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var fluid_1_5 = fluid_1_5 || {};

(function ($, fluid) {

    fluid.defaults("fluid.uiOptions.actionAnts", {
        gradeNames: ["fluid.modelComponent", "fluid.eventedComponent", "autoInit"]
    });
    
    /*******************************************************************************
     * Adds or removes the classname to/from the elements based upon the setting.
     * The grade component used by emphasizeLinksEnactor and inputsLargerEnactor
     *******************************************************************************/
    fluid.defaults("fluid.uiOptions.actionAnts.styleElementsEnactor", {
        gradeNames: ["fluid.uiOptions.actionAnts", "autoInit"],
        cssClass: null,
        model: {
            setting: false
        },
        invokers: {
            applyStyle: {
                funcName: "fluid.uiOptions.actionAnts.styleElementsEnactor.applyStyle",
                args: ["{arguments}.0", "{arguments}.1"]
            },
            resetStyle: {
                funcName: "fluid.uiOptions.actionAnts.styleElementsEnactor.resetStyle",
                args: ["{arguments}.0", "{arguments}.1"]
            },
            handleStyle: {
                funcName: "fluid.uiOptions.actionAnts.styleElementsEnactor.handleStyle",
                args: "{that}"
            },
            
            // Must be defined by implementors
            getElements: {}
        },
        events: {
            onReady: null,
            onApplyStyle: null,
            afterApplyStyle: null,
            onResetStyle: null,
            afterResetStyle: null
        }
    });
    
    fluid.uiOptions.actionAnts.styleElementsEnactor.applyStyle = function (elements, cssClass) {
        elements.addClass(cssClass);
    };

    fluid.uiOptions.actionAnts.styleElementsEnactor.resetStyle = function (elements, cssClass) {
        $("." + cssClass, elements).andSelf().removeClass(cssClass);
    };

    fluid.uiOptions.actionAnts.styleElementsEnactor.handleStyle = function (that) {
        if (typeof that.getElements !== 'function') {
            return;
        }
        
        var elements = that.getElements();
        
        if (that.model.setting) {
            that.events.onApplyStyle.fire();
            that.applyStyle(elements, that.options.cssClass);
            that.events.afterApplyStyle.fire();
        } else {
            that.events.onResetStyle.fire();
            that.resetStyle(elements, that.options.cssClass);
            that.events.afterResetStyle.fire();
        }
    };

    fluid.uiOptions.actionAnts.styleElementsEnactor.finalInit = function (that) {
        that.applier.modelChanged.addListener("setting", that.handleStyle);
        
        that.handleStyle();
        that.events.onReady.fire(that);
    };
    
    /*******************************************************************************
     * The enactor to emphasize links in the container according to the setting
     *******************************************************************************/
    fluid.defaults("fluid.uiOptions.actionAnts.emphasizeLinksEnactor", {
        gradeNames: ["fluid.uiOptions.actionAnts.styleElementsEnactor", "autoInit"],
        container: null,
        cssClass: "fl-link-enhanced",
        invokers: {
            getElements: {
                funcName: "fluid.uiOptions.actionAnts.emphasizeLinksEnactor.getLinks",
                args: "{that}.options.container"
            }
        }
    });
    
    fluid.uiOptions.actionAnts.emphasizeLinksEnactor.getLinks = function (container) {
        return $("a", container);
    };
    
    /*******************************************************************************
     * The enactor to enlarge inputs in the container according to the setting
     *******************************************************************************/
    fluid.defaults("fluid.uiOptions.actionAnts.inputsLargerEnactor", {
        gradeNames: ["fluid.uiOptions.actionAnts.styleElementsEnactor", "autoInit"],
        container: null,
        cssClass: "fl-text-larger",
        invokers: {
            getElements: {
                funcName: "fluid.uiOptions.actionAnts.inputsLargerEnactor.getInputs",
                args: "{that}.options.container"
            }
        }
    });
    
    fluid.uiOptions.actionAnts.inputsLargerEnactor.getInputs = function (container) {
        return $("input, button", container);
    };
    
})(jQuery, fluid_1_5);
