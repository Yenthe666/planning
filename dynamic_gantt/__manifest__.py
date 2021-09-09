{
    "name": "Dynamic Gantt",
    "author": "Mainframe Monkey BV",
    "description": "Used for making gantt view dynamic.",
    "website": "https://www.mainframemonkey.com",
    "category": "",
    "version": "14.0.0.0.2",
    "depends": ["base", "web_gantt", "hr"],
    "data": [
        "views/res_users_views.xml",
        "views/templates.xml",
    ],
    "qweb": [
        "static/src/xml/web_gantt.xml",
    ],
    "maintainers": ["bizzappdev"],
    "installable": True,
    "application": False,
    "license": "LGPL-3",
}
