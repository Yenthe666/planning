odoo.define("duplicate_planning_slot.GanttRow", function(require) {
    "use strict";

    const GanttRow = require("web_gantt.GanttRow");

    return GanttRow.include({
        events: _.extend({}, GanttRow.prototype.events, {
            "click .o_gantt_slot_buttons > div > .o_gantt_cell_duplicate": "_onButtonDuplicateClicked",
            "click .o_gantt_cell_buttons > div > .o_gantt_cell_duplicate": "_onFirstButtonDuplicateClicked",
            "mouseenter .o_gantt_cell": "_onCellEntered",
        }),

        lastFocusedPill: undefined,

        /**
         * Click handler for the duplicate button.
         *
         * Defers to GanttController custom event for handling logic.
         *
         * This assumes that the button clicked lives somewhere inside of the
         * .o_gantt_pill div and that the .o_gantt_pill div has its id stored
         * in a data tag, like:
         *
         *     <div class="o_gantt_pill_wrapper" t-foreach="slot.pills" t-as="pill">
         *         <div class="o_gantt_pill" t-att-data-id="pill.id">
         *             <button>My Duplicate Button</button>
         *         </div>
         *     </div>
         *
         * @private
         * @params {MouseEvent} event
         */
        _onButtonDuplicateClicked(event) {
            event.stopPropagation();

            this.trigger_up("duplicate_button_clicked", {
                slotId: Number(event.target.closest(".o_gantt_pill[data-id]").dataset.id),
            });
        },

        /**
         * Click handler for the first duplicate button in a cell.
         *
         * The duplicate buttons are split into two sections. 1. for the first
         * button which is grouped together with the cell action (create, plan,
         * etc.) and then 2. the rest of the pills in the cell.
         *
         * Since the first button lives in a different part of the dom, we
         * handle finding its id slightly differently then the other
         * _onButtonDuplicateClicked event. This will look up to the cell and
         * then find the first pill.
         *
         *     <div class="o_gantt_cell">
         *         <div t-if="slot.hasButtons" class="o_gantt_cell_buttons">
         *             <div class="position-absolute d-flex">
         *                 <button>The First Duplicate Button Should Be Here</button>
         *             </div>
         *         </div>
         *
         *         <div class="o_gantt_pill_wrapper" t-foreach="slot.pills" t-as="pill">
         *             <div class="o_gantt_pill" t-att-data-id="pill.id"></div>
         *         </div>
         *     </div>
         *
         * @private
         * @param {MouseEvent} event
         */
        _onFirstButtonDuplicateClicked(event) {
            event.stopPropagation();

            const pillEl = event.target.closest(".o_gantt_cell").querySelector(".o_gantt_pill[data-id]") || this.lastFocusedPill;

            if(pillEl) {
                this.trigger_up("duplicate_button_clicked", {
                    slotId: Number(pillEl.dataset.id)
                });
            }
        },

        /**
         * Override to prevent popups from rendering in the case of errors.
         *
         * Adding per pill buttons sometimes cause obscure popup errors on hover
         * because the lib controlling popups must be using the mouse
         * target to get data.
         *
         * @override
         * @private
         * @param {Element} target
         */
        _bindPillPopover: function(target) {
            var self = this;
            var $target = $(target);
            if (!$target.hasClass('o_gantt_pill')) {
                $target = this.$(target.offsetParent);
            }

            $target.popover({
                container: this.$el,
                trigger: 'hover',
                delay: {show: this.POPOVER_DELAY},
                html: true,
                placement: 'auto',
                content: function () {
                    try {
                        return self.viewInfo.popoverQWeb.render('gantt-popover', self._getPopoverContext($(this).data('id')));
                    }
                    catch {
                        return "";
                    }
                },
            }).popover("show");
        },

        /**
         * Cache the last pill that was hovered over.
         *
         * @override
         * @private
         * @param {MouseEvent} event
         */
        _onPillEntered(event) {
            this.lastFocusedPill = event.currentTarget;
            return this._super.apply(this, arguments);
        },

        /**
         * Reset the last pill cache when hovering over an empty cell.
         *
         * This prevents the user from duplicating the previously hovered pill
         * after moving into an empty cell (where there's nothing to duplicate).
         *
         * @private
         * @param {MouseEvent} event
         */
        _onCellEntered(event) {
            const enteredPill = Boolean(event.target.closest('.o_gantt_pill_wrapper'));
            const eneterdCellButtons = Boolean(event.target.closest('.o_gantt_cell_buttons'));

            if(!enteredPill && !eneterdCellButtons) {
                this.lastFocusedPill = false;
            }
        }
    });
});
