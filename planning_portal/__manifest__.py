# -*- coding: utf-8 -*-
{
    "name": "Planning portal",
    "summary": "This module makes it possible to view the planning as a portal user.",
    "description": "This module makes it possible to view the planning as a portal user.",
    "author": "Mainframe Monkey",
    "website": "https://www.mainframemonkey.com",
    "category": "Uncategorized",
    "version": "14.0.0.0.1",
    # any module necessary for this one to work correctly
    "depends": [
        "planning",
        "sale_management",
        "portal",
    ],
    # always loaded
    "data": [
        # Security
        'security/ir.model.access.csv',
        # Views
        'views/planning_portal_templates.xml',
        "views/planning_slot_views.xml",
    ],
}
