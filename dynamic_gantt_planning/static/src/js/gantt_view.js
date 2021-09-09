odoo.define("dynamic_gantt_planning.GanttView", function (require) {
    "use strict";

    var GanttView = require("web_gantt.GanttView");
    var GanttModel = require("web_gantt.GanttModel");
    var GanttRenderer = require("web_gantt.GanttRenderer");
    var GanttController = require("web_gantt.GanttController");
    var pyUtils = require("web.py_utils");
    var core = require("web.core");

    var _t = core._t;

    var DynamicPlanningGanttView = GanttView.include({
        // Extend the config of the GanttView
        config: _.extend({}, GanttView.prototype.config, {
            Model: GanttModel,
            Controller: GanttController,
            Renderer: GanttRenderer,
        }),

        init: function (viewInfo, params) {
            var self = this;
            this._super.apply(this, arguments);

            // Bizz Customizations starts
            // Add new scales for the dynamic
            this.SCALES = _.extend(self.SCALES, {
                dynamic: {
                    string: _t("Dynamic"),
                    cellPrecisions: {full: 24, half: 12},
                    defaultPrecision: "half",
                    time: "hours",
                    interval: "day",
                },
            });
            // Bizz Customizations ends

            var arch = this.arch;
            // Decoration fields
            var decorationFields = [];
            _.each(arch.children, function (child) {
                if (child.tag === "field") {
                    decorationFields.push(child.attrs.name);
                }
            });

            // Redefine for the precision and arch for dynamic range
            var precisionAttrs = arch.attrs.precision
                ? pyUtils.py_eval(arch.attrs.precision)
                : {};
            var cellPrecisions = {};
            _.each(this.SCALES, function (vals, key) {
                if (precisionAttrs[key]) {
                    /* Hour:half
                    Note that precision[0] (which is the cell interval) is not
                    taken into account right now because it is no customizable.*/
                    var precision = precisionAttrs[key].split(":");
                    if (
                        precision[1] &&
                        _.contains(_.keys(vals.cellPrecisions), precision[1])
                    ) {
                        cellPrecisions[key] = precision[1];
                    }
                }
                cellPrecisions[key] = cellPrecisions[key] || vals.defaultPrecision;
            });

            var allowedScales = Object.keys(this.SCALES);
            if (arch.attrs.scales) {
                var possibleScales = Object.keys(this.SCALES);
                allowedScales = _.reduce(
                    arch.attrs.scales.split(","),
                    function (new_allowedScales, scale) {
                        if (possibleScales.indexOf(scale) >= 0) {
                            new_allowedScales.push(scale.trim());
                        }
                        return new_allowedScales;
                    },
                    []
                );
            }

            var scale =
                params.context.default_scale || arch.attrs.default_scale || "month";

            this.controllerParams.SCALES = this.SCALES;
            this.rendererParams.fieldsInfo = viewInfo.fields;
            this.controllerParams.allowedScales = allowedScales;

            this.loadParams.dateStartField = arch.attrs.date_start;
            this.loadParams.dateStopField = arch.attrs.date_stop;
            this.loadParams.dynamicRange = this.arch.attrs.dynamic_range;

            this.loadParams.scale = scale;
            this.loadParams.SCALES = this.SCALES;
            this.rendererParams.SCALES = this.SCALES;
            this.rendererParams.cellPrecisions = cellPrecisions;
            this.rendererParams.totalRow = arch.attrs.total_row || false;
        },
    });

    return DynamicPlanningGanttView;
});
