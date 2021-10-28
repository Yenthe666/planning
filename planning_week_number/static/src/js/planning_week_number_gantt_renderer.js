odoo.define("planning_week_number.GanttRenderer", function (require) {
    "use strict";
    var GanttRenderer = require("web_gantt.GanttRenderer");
    var GanttRow = require("web_gantt.GanttRow");
    var PlanningGanttRenderer1 = GanttRenderer.include({
        config: {
            GanttRow: GanttRow,
        },
        _getFocusDateFormat: function () {
            /* Override the method to add a case for day, week and month for displaying
            the week number */
            var focusDate = this.state.focusDate;
            var self = this;
            var dateStart = false;
            var dateEnd = false;
            var weekNumber = focusDate.clone().weeks() - 1;
            switch (this.state.scale) {
                // Add week number for the day view
                case "day":
                    return _.str.sprintf(
                        "%s ( Week %s)",
                        focusDate.format("dddd, MMMM DD, YYYY"),
                        weekNumber
                    );
                // Add week number for the week view
                case "week":
                    var dateStart = focusDate
                        .clone()
                        .startOf("week")
                        .format("DD MMMM YYYY");
                    var dateEnd = focusDate
                        .clone()
                        .endOf("week")
                        .format("DD MMMM YYYY");
                    return _.str.sprintf(
                        "%s - %s ( Week %s )",
                        dateStart,
                        dateEnd,
                        weekNumber
                    );
                // Add week number for the month view
                case "month":
                    var firstDay = focusDate.clone().startOf("month").weeks() - 1;
                    var lastDay = focusDate.clone().endOf("month").weeks() - 1;
                    return _.str.sprintf(
                        "%s ( W%s-W%s )",
                        focusDate.format("MMMM YYYY"),
                        firstDay,
                        lastDay
                    );
                default:
                    return self._super();
            }
        },
    });
    return PlanningGanttRenderer1;
});
