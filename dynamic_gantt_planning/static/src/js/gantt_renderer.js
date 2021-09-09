odoo.define("dynamic_gantt_planning.GanttRenderer", function (require) {
    "use strict";

    var GanttRenderer = require("web_gantt.GanttRenderer");
    var GanttRow = require("web_gantt.GanttRow");
    var session = require("web.session");

    var PlanningGanttRenderer = GanttRenderer.include({
        config: {
            GanttRow: GanttRow,
        },
        _getFocusDateFormat: function () {
            /* Override the method to add case for days_past and days_future to display the
        date based on the user's configuration #371 */
            var focusDate = this.state.focusDate;
            var self = this;
            var dateStart = false;
            var dateEnd = false;
            switch (self.state.scale) {
                case "day":
                    return focusDate.format("dddd, MMMM DD, YYYY");
                case "week":
                    dateStart = focusDate
                        .clone()
                        .startOf("week")
                        .format("DD MMMM YYYY");
                    dateEnd = focusDate.clone().endOf("week").format("DD MMMM YYYY");
                    return _.str.sprintf("%s - %s", dateStart, dateEnd);
                case "month":
                    return focusDate.format("MMMM YYYY");
                case "year":
                    return focusDate.format("YYYY");
                // Bizz Customization starts #371
                case "dynamic":
                    // Adjust dateStart and dateStop for the days_past and days_future #371
                    var past_days = session.user_context.days_past;
                    var future_days = session.user_context.days_future;

                    if (self.days_past) {
                        past_days = self.days_past;
                    }

                    if (self.future_days) {
                        future_days = self.future_days;
                    }
                    dateStart = focusDate
                        .clone()
                        .date(focusDate.date() - parseInt(past_days, 10))
                        .format("DD MMMM YYYY");
                    dateEnd = focusDate
                        .clone()
                        .date(focusDate.date() + parseInt(future_days, 10))
                        .format("DD MMMM YYYY");
                    if (dateStart === dateEnd) {
                        return _.str.sprintf("%s", dateStart);
                    }
                    return _.str.sprintf("%s - %s", dateStart, dateEnd);
                // Bizz Customization ends #371
                default:
                    break;
            }
        },
    });

    return PlanningGanttRenderer;
});
