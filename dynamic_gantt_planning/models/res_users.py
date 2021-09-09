from odoo import _, api, fields, models
from odoo.exceptions import UserError


class ResUsers(models.Model):
    _inherit = "res.users"

    context_days_past = fields.Integer(
        string="Days past",
        default=5,
    )

    context_days_future = fields.Integer(
        string="Days future",
        default=5,
    )

    @api.constrains("context_days_past", "context_days_future")
    def _check_days_config(self):
        """Add check method for the context_days_past, context_days_future to check for
        proper value or raise validation"""
        if self.context_days_past < 1 or self.context_days_future < 1:
            raise UserError(
                _("Please configure proper value for Days Past & Days Future")
            )
