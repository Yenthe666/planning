odoo.define("dynamic_gantt.GanttModel", function (require) {
    "use strict";

    var GanttModel = require("web_gantt.GanttModel");
    var session = require("web.session");

    var PlanningGanttModel = GanttModel.include({
        _setRange: function (focusDate, scale) {
            /* Override _setRange method to set the range for when user selects Days Past or
        Days Future in gantt view */
            var self = this;
            this.ganttData.scale = scale;
            this.ganttData.focusDate = focusDate;
            var startDate = false;
            var stopDate = false;
            if (this.ganttData.dynamicRange) {
                this.ganttData.startDate = focusDate
                    .clone()
                    .startOf(this.SCALES[scale].interval);
                this.ganttData.stopDate = this.ganttData.startDate
                    .clone()
                    .add(1, scale);
            }
            // Bizz Customizations starts
            else if (this.ganttData.scale === "dynamic") {
                // Adjust startDate of ganttData according to user configuration
                var past_days = session.user_context.days_past;
                var future_days = session.user_context.days_future;

                if (self.past_days) {
                    past_days = self.past_days;
                }

                if (self.future_days) {
                    future_days = self.future_days;
                }
                // StartDate (Pastdays)
                startDate = focusDate
                    .clone()
                    .date(focusDate.clone().date() - parseInt(past_days, 10));
                startDate.set({h: 0, m: 0, s: 0});

                // StopDate (FutureDays)
                stopDate = focusDate
                    .clone()
                    .date(focusDate.clone().date() + parseInt(future_days, 10));
                stopDate.set({h: 23, m: 59, s: 59});
                this.ganttData.startDate = startDate.startOf('day');
                this.ganttData.stopDate = stopDate.endOf('day');
            }
            // Bizz Customizations ends
            else {
                this.ganttData.startDate = focusDate.clone().startOf(scale);
                this.ganttData.stopDate = focusDate.clone().endOf(scale);
            }
        },
    });
    return PlanningGanttModel;
});
