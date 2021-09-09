odoo.define("dynamic_gantt.DynamicGanttController", function (require) {
    "use strict";

    /* eslint no-unused-vars: ["error", { "args": "none" }]*/

    var GanttController = require("web_gantt.GanttController");
    var session = require("web.session");

    GanttController.include({
        // Inherit the events and add new button click event
        events: _.extend({}, GanttController.prototype.events, {
            "click .o_gantt_button_reload": "_onEnteredDays",
        }),
        // Inherit and add days_past, days_future
        init: function (parent, model, renderer, params) {
            this.days_past = session.user_context.days_past;
            this.days_future = session.user_context.days_future;
            this._super.apply(this, arguments);
        },

        _onScaleClicked: function (ev) {
            /* On click of button made the Days past or future input field visible also
             also made visible for reload button based on condition*/
            this._super.apply(this, arguments);
            var $button = $(ev.currentTarget);
            var scale = $button.data("value");
            if (scale === "dynamic") {
                this.$(".js_days_future").removeClass("d-none");
                this.$(".o_gantt_button_reload").removeClass("d-none");
                this.$(".js_days_past").removeClass("d-none");
            } else {
                this.$(".o_gantt_button_reload").addClass("d-none");
                this.$(".js_days_future").addClass("d-none");
                this.$(".js_days_past").addClass("d-none");
            }
        },

        _onAddClicked: function (ev) {
            /* Inherit _onAddClicked to adjust the date when dynamic is set in scale
            and so the width is properly adjusted */
            ev.preventDefault();
            var context = {};
            var state = this.model.get();
            if (state.scale === "dynamic"){
                context[state.dateStartField] = this.model.convertToServerTime(state.focusDate.clone().startOf('day'));
                context[state.dateStopField] = this.model.convertToServerTime(state.focusDate.clone().endOf('day'));
                for (var k in context) {
                    context[_.str.sprintf('default_%s', k)] = context[k];
                }
                this._onCreate(context);
            }
            else {
                this._super(ev);
            }
        },

        _onEnteredDays: function () {
            /* Add new method on days entered and click on reload button to write the
            input fields value in the user level and render according to buttons
            */
            var self = this;
            var state = this.model.get();
            var past_days = this.$("input.js_days_past").val();
            var future_days = this.$("input.js_days_future").val();
            if (state.scale === "dynamic") {
                return this._rpc({
                    model: "res.users",
                    method: "write",
                    args: [
                        [session.uid],
                        {
                            context_days_past: past_days,
                            context_days_future: future_days,
                        },
                    ],
                }).then(function () {
                    self.model.past_days = past_days;
                    self.model.future_days = future_days;

                    self.renderer.days_past = past_days;
                    self.renderer.future_days = future_days;

                    self.renderer._render();
                    $('button.o_gantt_button_scale[data-value="dynamic"]').click();
                });
            }
        },
    });
});
