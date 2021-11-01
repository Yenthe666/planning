odoo.define("dynamic_gantt.GanttRow", function (require) {
    "use strict";

    /* eslint no-unused-vars: ["error", { "args": "none" }]*/

    var GanttRow = require("web_gantt.GanttRow");

    var PlanningGanttRow = GanttRow.include({
        _calculateMarginAndWidth: function () {
            /* Inherit the _calculateMarginAndWidth method to calculate the margin and
            width for the pill*/
            var self = this;
            var left = false;
            var diff = false;
            var gapSize = 0;
            this.pills.forEach(function (pill) {
                switch (self.state.scale) {
                    // Calculate the margin and width for the pill for dynamic
                    case "dynamic":
                        left = pill.startDate.diff(pill.startDate.clone().startOf('day'), 'hours');
                        diff = pill.stopDate.diff(pill.startDate, 'hours');
                        if (diff < 24){
                            diff = 24;
                            left=0;
                        }
                        pill.leftMargin = (left / 24) * 100;
                        var gapSize = pill.stopDate.diff(pill.startDate, 'days') - 1; // Eventually compensate border(s) width
                        pill.width = gapSize > 0 ? 'calc(' + (diff / 24) * 100 + '% + ' + gapSize + 'px)' : (diff / 24) * 100 + '%';
                        break;
                    default:
                        break;
                }
            });
            this._super();
        },
    });

    return PlanningGanttRow;
});
