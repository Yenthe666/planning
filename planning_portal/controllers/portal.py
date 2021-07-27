# -*- coding: utf-8 -*-
from odoo import http, _
from odoo.exceptions import AccessError, MissingError
from odoo.http import request
from odoo.addons.portal.controllers.portal import CustomerPortal, pager as portal_pager


class CustomerPortal(CustomerPortal):

    def _prepare_home_portal_values(self, counters):
        values = super()._prepare_home_portal_values(counters)
        if 'planning_count' in counters:
            domain = ['|',
                      ('user_id', '=', http.request.env.user.id),
                      ('customer_id', '=', http.request.env.user.partner_id.id),
                      ('is_visible_portal', '=', True)
                      ]
            if http.request.env.user.employee_id.id:
                domain += [('employee_id', '=', http.request.env.user.employee_id.id)]

            values['planning_count'] = request.env['planning.slot'].search_count(domain)
        return values

    # ------------------------------------------------------------
    # My Project
    # ------------------------------------------------------------
    def _planning_get_page_view_values(self, planning, access_token, **kwargs):
        values = {
            'page_name': 'planning',
            'p': planning,
        }
        return self._get_page_view_values(planning, access_token, values, 'my_planning_history', False, **kwargs)

    @http.route(['/my/planning', '/my/planning/page/<int:page>'], type='http', auth="user", website=True)
    def portal_my_planning(self, page=1, date_begin=None, date_end=None, sortby=None, **kw):
        values = self._prepare_portal_layout_values()
        Planning = request.env['planning.slot']
        # Base domain - either the customer or the user matches
        domain = ['|',
                  ('user_id', '=', http.request.env.user.id),
                  ('customer_id', '=', http.request.env.user.partner_id.id),
                  ('is_visible_portal', '=', True)
                  ]

        searchbar_sortings = {
            'date': {'label': _('Newest'), 'order': 'create_date desc'},
            'name': {'label': _('Name'), 'order': 'name'},
        }
        if not sortby:
            sortby = 'date'
        order = searchbar_sortings[sortby]['order']

        if http.request.env.user.employee_id.id:
            domain += [('employee_id', '=', http.request.env.user.employee_id.id)]
        if date_begin and date_end:
            domain += [('create_date', '>', date_begin), ('create_date', '<=', date_end)]

        # projects count
        planning_count = Planning.search_count(domain)
        # pager
        pager = portal_pager(
            url="/my/planning",
            url_args={
                'date_begin': date_begin,
                'date_end': date_end,
                'sortby': sortby
            },
            total=planning_count,
            page=page,
            step=self._items_per_page
        )

        # content according to pager and archive selected
        planning = Planning.search(domain, order=order, limit=self._items_per_page, offset=pager['offset'])
        request.session['my_planning_history'] = planning.ids[:100]

        values.update({
            'date': date_begin,
            'date_end': date_end,
            'planning': planning.sudo(),
            'page_name': 'planning',
            'default_url': '/my/planning',
            'pager': pager,
            'searchbar_sortings': searchbar_sortings,
            'sortby': sortby
        })
        return request.render("planning_portal.portal_my_planning", values)

    @http.route(['/my/planning/<int:planning_id>'], type='http', auth="public", website=True)
    def portal_my_planning_item(self, planning_id=None, access_token=None, **kw):
        try:
            planning_sudo = self._document_check_access('planning.slot', planning_id, access_token)
        except (AccessError, MissingError):
            return request.redirect('/my')

        values = self._planning_get_page_view_values(planning_sudo, access_token, **kw)
        return request.render("planning_portal.portal_my_planning_item", values)