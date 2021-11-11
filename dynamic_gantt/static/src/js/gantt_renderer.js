odoo.define("dynamic_gantt.GanttRenderer", function (require) {
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
        date based on the user's configuration*/
            var focusDate = this.state.focusDate;
            var self = this;
            var dateStart = false;
            var dateEnd = false;
            switch (self.state.scale) {
                /* Remove the day, week, month, year code for compatibility issue
                   with module planning_week_number */
                // Bizz Customization starts
                case "dynamic":
                    // Adjust dateStart and dateStop for the days_past and days_future
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
                // Bizz Customization ends
                default:
                    // call super for the cases of day, week, month, year.
                    return self._super();
            }
        },
    });

    return PlanningGanttRenderer;
});
