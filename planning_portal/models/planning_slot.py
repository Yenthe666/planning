# -*- coding: utf-8 -*-
from odoo import models, fields


class PlanningSlot(models.Model):
    _inherit = "planning.slot"

    is_visible_portal = fields.Boolean(
        string='Visible on portal',
        default=True,
        help='If unchecked the customer will not see this planning slot, otherwise the customer will see it.'
    )

    customer_id = fields.Many2one(
        comodel_name='res.partner',
        string='Customer',
        help='If the customer is filled in and the field \'Visible on portal\' is checked on the customer can see '
             'this planning slot in the portal.'
    )

    def open_form(self):
        return {
            'type': 'ir.actions.act_window',
            'view_type': 'form',
            'view_id': self.env.ref('planning_portal.planning_slot_view_form_inherit').id,
            'view_mode': 'form',
            'res_model': 'planning.slot',
            'context': {},
            'res_id': self.id,
            'target': 'current',
        }
