/*
Copyright 2008-2009 University of Cambridge
Copyright 2008-2009 University of Toronto
Copyright 2010-2011 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// Declare dependencies
/*global fluid_1_4:true, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var fluid_1_4 = fluid_1_4 || {};


/******************
 * Textfield Slider *
 ******************/

(function ($, fluid) {    

    fluid.defaults("fluid.textfieldSlider", {
        gradeNames: ["fluid.viewComponent", "autoInit"], 
        selectors: {
            textfield: ".flc-textfieldSlider-field",
            slider: ".flc-textfieldSlider-slider"
        },
        events: {
            modelChanged: null
        },
        model: {
            value: null,
            min: 0,
            max: 100
        },
        components: {
            textfield: {
                type: "fluid.textfieldSlider.textfield"
            },
            slider: {
                type: "fluid.textfieldSlider.slider"
            }
        }
    });

    // make preview work
    
    
    fluid.defaults("fluid.textfieldSlider.textfield", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        invokers: {
            refreshView: {
                funcName: "fluid.textfieldSlider.textfield.refreshView",
                args: ["{textfield}.container", "{textfieldSlider}.applier.model"]
            }
        },
        finalInitFunction: "fluid.textfieldSlider.textfield.init"
    });

    fluid.textfieldSlider.textfield.refreshView = function (container, model) {
        // Can I use autobinding here?
        container.val(model.value);
    };
    
    fluid.textfieldSlider.textfield.init = function (that) {
        that.container.change(function () {
            var value = this.value; 
            var isValid = !(isNaN(parseInt(value, 10)) || isNaN(value));

            if (isValid) {
                if (value < that.model.min) {
                    value = that.model.min;
                } else if (value > that.model.max) {
                    value = that.model.max;
                }
                
                that.applier.requestChange("value", value);
            } else {
                that.container.val(that.applier.model.value);
            }
        });

        that.applier.modelChanged.addListener("value", that.refreshView);

        that.refreshView();
    };

    fluid.demands("fluid.textfieldSlider.textfield", "fluid.textfieldSlider", {
        container: "{textfieldSlider}.dom.textfield",
        options: {
            model: "{textfieldSlider}.model",
            applier: "{textfieldSlider}.applier"
        }
    });


    
    fluid.defaults("fluid.textfieldSlider.slider", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        invokers: {
            refreshView: {
                funcName: "fluid.textfieldSlider.slider.refreshView",
                args: ["{slider}.slider", "{textfieldSlider}.applier.model"]
            }
        },
        finalInitFunction: "fluid.textfieldSlider.slider.init"
    });
    
    fluid.textfieldSlider.slider.refreshView = function (slider, model) {
        slider.slider("value", model.value);
    };

    fluid.textfieldSlider.slider.init = function (that) {       
        that.slider = that.container.slider(that.model);
        
        that.slider.bind("slide", function (e, ui) {
            that.applier.requestChange("value", ui.value);
        });
        
        that.applier.modelChanged.addListener("value", that.refreshView);

        return that;
    };

    fluid.demands("fluid.textfieldSlider.slider", "fluid.textfieldSlider", {
        container: "{textfieldSlider}.dom.slider",
        options: {
            model: "{textfieldSlider}.model",
            applier: "{textfieldSlider}.applier"
        }
    });

    
})(jQuery, fluid_1_4);


/**************
 * UI Options *
 **************/

(function ($, fluid) {

//    TODO
//    - move the general renderer tree generation functions to the renderer
//    - add the min font size textfieldSlider to the renderer tree
//    - pull the strings out of the template and put them into the component?
//    - should the accordian be part of the component by default?

    var createSelectNode = function (id, selection, list, names) {
        return {
            ID: id,
            selection: {
                valuebinding: selection
            },
            optionlist: {
                valuebinding: list
            },
            optionnames: {
                valuebinding: names
            }
        };
    };
        
    var createSimpleBindingNode = function (id, binding) {
        return {
            ID: id,
            valuebinding: binding
        };
    };
    
    var generateTree = function (that, rendererModel) {
        var children = [];
        children.push(createSelectNode("text-font", "selections.textFont", "labelMap.textFont.values", "labelMap.textFont.names"));
        children.push(createSelectNode("text-spacing", "selections.textSpacing", "labelMap.textSpacing.values", "labelMap.textSpacing.names"));
        children.push(createSelectNode("theme", "selections.theme", "labelMap.theme.values", "labelMap.theme.names"));

        var bgiExplodeOpts = {
            selectID: "background-images",
            rowID: "background-images-row:",
            inputID: "background-images-choice",
            labelID: "background-images-label"
        };        
        children.push(createSelectNode("background-images", "selections.backgroundImages", "labelMap.backgroundImages.values", "labelMap.backgroundImages.names"));
        children = children.concat(fluid.explodeSelectionToInputs(that.options.controlValues.backgroundImages, bgiExplodeOpts));
        
        var layoutExplodeOpts = {
            selectID: "layout",
            rowID: "layout-row:",
            inputID: "layout-choice",
            labelID: "layout-label"
        };        
        children.push(createSelectNode("layout", "selections.layout", "labelMap.layout.values", "labelMap.layout.names"));
        children = children.concat(fluid.explodeSelectionToInputs(that.options.controlValues.layout, layoutExplodeOpts));

        var tocExplodeOpts = {
            selectID: "toc",
            rowID: "toc-row:",
            inputID: "toc-choice",
            labelID: "toc-label"
        };        
        children.push(createSelectNode("toc", "selections.toc", "labelMap.toc.values", "labelMap.toc.names"));
        children = children.concat(fluid.explodeSelectionToInputs(that.options.controlValues.layout, tocExplodeOpts));

        children.push(createSimpleBindingNode("links-underline", "selections.linksUnderline"));
        children.push(createSimpleBindingNode("links-bold", "selections.linksBold"));
        children.push(createSimpleBindingNode("links-larger", "selections.linksLarger"));
        children.push(createSimpleBindingNode("inputs-larger", "selections.inputsLarger"));
        
        return {
            children: children
        };
    };
    
    var bindHandlers = function (that) {
        var saveButton = that.locate("save");
        saveButton.click(that.save);
        that.locate("reset").click(that.reset);
        that.locate("cancel").click(that.cancel);
        var form = fluid.findForm(saveButton);
        $(form).submit(function () {
            that.save();
        });
    };
        
    var createLabelMap = function (options) {
        var labelMap = {};
        
        for (var item in options.controlValues) {
            labelMap[item] = {
                names: options.strings[item],
                values: options.controlValues[item]
            };
        }
        
        return labelMap;
    };

    var createRenderOptions = function (that) {
        // Turn the boolean select values into strings so they can be properly bound and rendered
        that.model.toc = String(that.model.toc);
        that.model.backgroundImages = String(that.model.backgroundImages);
        
        var aggregateModel = fluid.assembleModel({
            selections: {
                model: that.model,
                applier: that.applier
            },
            labelMap: {model: createLabelMap(that.options)}
        });
        
        return {
            model: aggregateModel.model,
            applier: aggregateModel.applier,
            autoBind: true
        };
    };
    
    var initSliders = function (that) {
        var createOptions = function (settingName) {
            return {
                listeners: {
                    modelChanged: function (model) {
                        that.applier.requestChange(settingName, model.value);
                    }
                },
                model: {value: that.model[settingName]}
            };    
        };
        
        var options = createOptions("textSize");
        fluid.merge(null, options, that.options.textMinSize.options);
        fluid.initSubcomponents(that, "textMinSize", [that.options.selectors.textMinSizeCtrl, options]);

        options = createOptions("lineSpacing");
        fluid.merge(null, options, that.options.lineSpacing.options);
        fluid.initSubcomponents(that, "lineSpacing", [that.options.selectors.lineSpacingCtrl, options]);
        
    };
        
    var mergeSiteDefaults = function (options, siteDefaults) {
        for (var settingName in options.controlValues) {
            var setting = String(siteDefaults[settingName]);
            var settingValues = options.controlValues[settingName];
            
            if (setting) {
                var index = $.inArray(setting, settingValues);
                if (index === -1) {
                    var defaultIndex = $.inArray("default", settingValues);
                    if (defaultIndex === -1) {
                        settingValues.push(setting);
                    } else {
                        settingValues[defaultIndex] = setting;
                    }
                }
            }
        }
    };
    
    var firstRender = function (that) {
        var rendererOptions = createRenderOptions(that);
        var tree = generateTree(that, rendererOptions.model);
        var source = {node: that.locate("controls")};
        
        that.templates = fluid.render(source, that.locate("controls"), tree, rendererOptions);
        that.events.afterRender.fire();
        that.events.onReady.fire();
    };
    
    var setupUIOptions = function (that) {
        fluid.initDependents(that);
        that.applier.modelChanged.addListener("*",
            function (newModel, oldModel, changeRequest) {
                that.events.modelChanged.fire(newModel, oldModel, changeRequest.source);
            }
        );
            
        mergeSiteDefaults(that.options, that.uiEnhancer.defaultSiteSettings);
        
        // TODO: This stuff should already be in the renderer tree
        that.events.afterRender.addListener(function () {
            initSliders(that);
            bindHandlers(that);
        });
        
        if (!that.options.templateUrl) {
            firstRender(that);
        } else {
            // Fetch UI Options' template and parse it on arrival.
            fluid.fetchResources({
                uiOptions: {
                    href: that.options.templateUrl
                }
            }, function (spec) {
                that.container.append(spec.uiOptions.resourceText);
                firstRender(that);
            });
        }
    };
    
    /**
     * A component that works in conjunction with the UI Enhancer component and the Fluid Skinning System (FSS) 
     * to allow users to set personal user interface preferences. The UI Options component provides a user 
     * interface for setting and saving personal preferences, and the UI Enhancer component carries out the 
     * work of applying those preferences to the user interface.
     * 
     * @param {Object} container
     * @param {Object} options
     */
    fluid.uiOptions = function (container, options) {
        var that = fluid.initView("fluid.uiOptions", container, options);
        that.uiEnhancer = $(document).data("uiEnhancer");
        that.model = fluid.copy(that.uiEnhancer.model);
        that.applier = fluid.makeChangeApplier(that.model);

        // TODO: we shouldn't need the savedModel and should use the uiEnhancer.model instead
        var savedModel = that.uiEnhancer.model;
 
        /**
         * Saves the current model and fires onSave
         */ 
        that.save = function () {
            that.events.onSave.fire(that.model);
            savedModel = fluid.copy(that.model); 
            that.uiEnhancer.updateModel(savedModel);
        };

        /**
         * Resets the selections to the integrator's defaults and fires onReset
         */
        that.reset = function () {
            that.events.onReset.fire();
            that.updateModel(fluid.copy(that.uiEnhancer.defaultSiteSettings), that);
            that.refreshView();
        };
        
        /**
         * Resets the selections to the last saved selections and fires onCancel
         */
        that.cancel = function () {
            that.events.onCancel.fire();
            that.updateModel(fluid.copy(savedModel), that);
            that.refreshView();            
        };
        
        /**
         * Rerenders the UI and fires afterRender
         */
        that.refreshView = function () {
            var rendererOptions = createRenderOptions(that);
            fluid.reRender(that.templates, that.locate("controls"), generateTree(that, rendererOptions.model), rendererOptions);
            that.events.afterRender.fire();
        };
        
        /**
         * Updates the model and fires modelChanged
         * 
         * @param {Object} newModel
         * @param {Object} source
         */
        that.updateModel = function (newModel, source) {
            that.events.modelChanged.fire(newModel, that.model, source);
            fluid.clear(that.model);
            fluid.model.copyModel(that.model, newModel);
        };
        
        setupUIOptions(that);

        return that;   
    };

    fluid.defaults("fluid.uiOptions", {
        gradeNames: ["fluid.viewComponent"], 
        components: {
            preview: {
                type: "fluid.uiOptions.preview",
                createOnEvent: "onReady"
            }
        },
        textMinSize: {
            type: "fluid.textfieldSlider",
            options: {
                model: {
                    min: 6,
                    max: 30
                }
            }
        },
        lineSpacing: {
            type: "fluid.textfieldSlider",
            options: {
                model: {
                    min: 1,
                    max: 10
                }
            }
        },
        selectors: {
            controls: ".flc-uiOptions-controls",
            textMinSizeCtrl: ".flc-uiOptions-min-text-size",
            lineSpacingCtrl: ".flc-uiOptions-line-spacing",
            cancel: ".flc-uiOptions-cancel",
            reset: ".flc-uiOptions-reset",
            save: ".flc-uiOptions-save",
            previewFrame : ".flc-uiOptions-preview-frame"
        },
        events: {
            onReady: null,
            afterRender: null,
            modelChanged: null,
            onSave: null,
            onCancel: null,
            onReset: null
        },
        strings: {
            textFont: ["Serif", "Sans-Serif", "Arial", "Verdana", "Courier", "Times"],
            textSpacing: ["Regular", "Wide", "Wider", "Widest"],
            theme: ["Low Contrast", "Medium Contrast", "Medium Contrast Grey Scale", "High Contrast", "High Contrast Inverted"],
            backgroundImages: ["Yes", "No"],
            layout: ["Yes", "No"],
            toc: ["Yes", "No"]
        },
        controlValues: { 
            textFont: ["serif", "sansSerif", "arial", "verdana", "courier", "times"],
            textSpacing: ["default", "wide1", "wide2", "wide3"],
            theme: ["lowContrast", "default", "mediumContrast", "highContrast", "highContrastInverted"],
            backgroundImages: ["true", "false"],
            layout: ["simple", "default"],
            toc: ["true", "false"]
        },
        templateUrl: "UIOptions.html"
    });

    /**********************
     * UI Options Preview *
     **********************/

    var setupPreview = function (that) {
        fluid.initDependents(that);
        // TODO: Break out iFrame assumptions from Preview.
        that.container.attr("src", that.options.templateUrl);        

        that.container.load(function () {
            that.previewFrameContents = that.container.contents();
            that.events.onReady.fire();
        });
        
    };
    
    fluid.uiOptions.preview = function (container, options) {
        var that = fluid.initView("fluid.uiOptions.preview", container, options);
        
        that.updateModel = function (model) {
            /**
             * Setimeout is temp fix for http://issues.fluidproject.org/browse/FLUID-2248
             */
            setTimeout(function () {
                if (that.enhancer) {
                    that.enhancer.updateModel(model);
                }
            }, 0);
        };
        
        setupPreview(that);
        return that;
    };
    
    fluid.defaults("fluid.uiOptions.preview", {
        gradeNames: ["fluid.viewComponent"], 
        components: {
            enhancer: {
                type: "fluid.uiEnhancer",
                createOnEvent: "onReady",
                options: {
                    savedSettings: "{uiOptions}.model",
                    tableOfContents: "{uiOptions}.uiEnhancer.options.tableOfContents", // TODO: Tidy this up when the page's UI Enhancer is IoC-visible.
                    settingsStore: {
                        type: "fluid.uiEnhancer.tempStore"
                    }
                }
            },
            eventBinder: {
                type: "fluid.uiOptions.preview.eventBinder",
                createOnEvent: "onReady"
            }
        },
        
        events: {
            onReady: null
        },
        
        templateUrl: "UIOptionsPreview.html"
    });
    
    fluid.demands("fluid.uiOptions.preview", "fluid.uiOptions", {
        args: [
            "{uiOptions}.dom.previewFrame",
            "{options}"
        ]
    });
    
    fluid.demands("fluid.uiEnhancer", "fluid.uiOptions.preview", {
        funcName: "fluid.uiEnhancer",
        args: [
            "{preview}.previewFrameContents",
            "{options}"
        ]
    });
    
    /***
     * Event binder binds events between UI Options and the Preview
     */
    fluid.defaults("fluid.uiOptions.preview.eventBinder", {
        gradeNames: ["fluid.eventedComponent", "autoInit"]
    });
    
    fluid.demands("fluid.uiOptions.preview.eventBinder", ["fluid.uiOptions.preview", "fluid.uiOptions"], {
        options: {
            listeners: {
                "{uiOptions}.events.modelChanged": "{preview}.updateModel"
            }
        }
    });
})(jQuery, fluid_1_4);
