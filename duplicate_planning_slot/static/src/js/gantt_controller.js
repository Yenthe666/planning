odoo.define("duplicate_planning_slot.GanttController", function(require) {
    "use strict";

    const GanttController = require("web_gantt.GanttController");

    return GanttController.include({
        custom_events: _.extend({}, GanttController.prototype.custom_events, {
            duplicate_button_clicked: "_onCellDuplicateClicked",
        }),

        /**
         * Duplicates the record and opens an edit form view.
         *
         * @private
         * @param {OdooEvent} event
         */
        async _onCellDuplicateClicked(event) {
            event.stopPropagation();

            await this._copy(event.data.slotId, {});
            const newSlotEl = this.el.querySelector(`[data-id='${event.data.slotId}']`);
            newSlotEl.click();
        }
    });
});
