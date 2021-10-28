# planning
Apps related to Odoo it's planning features
- [planning_portal](#planning_portal): show the planning in the portal for subcontractors/customers
- [duplicate_planning_slots](#duplicate_planning_slots): add quick duplicate support to planning slots from the Gantt view
- [dynamic_gantt](#dynamic_gantt): add a dynamic view mode to Gantt views. This allows you to configure the days in the past/future for the Gantt view per user
- [dynamic_gantt_planning](#dynamic_gantt_planning): dynamic view mode for the planning app in Odoo. This view was heavily customized by Odoo SA for planning & we extended it.
- [planning_week_number](#planning_week_number): show the week number in the Gantt view title for the day, week and month view.


## planning_portal
Adds support so show planning slots in the portal (under /my/home) to your customers.<br/>
This module allows you to set a customer on the planning slot and to define if you want to show it or not (thanks to the field 'Visible on portal').
![image](https://user-images.githubusercontent.com/6352350/127106218-750b9eb3-eb30-4319-996f-c0c5fb81d3d5.png)

The customer can then in the portal see the planning slots:
![image](https://user-images.githubusercontent.com/6352350/127106318-08af6eaf-7a74-4c9f-b44f-4636b755d202.png)

Every planning slot it's detail can be viewed in a separate page:
![image](https://user-images.githubusercontent.com/6352350/127108276-f1a64311-eeda-4f4f-86dd-3ce6239c4eb5.png)


## duplicate_planning_slots
Adds support for a duplicate icon in the Gantt view.<br/>
This module allows you to quick duplicate (copy) planning slots from the Gantt view:
![image](https://user-images.githubusercontent.com/6352350/132170667-c944c45b-866c-413c-a0f6-c243bacea2a1.png)


## dynamic_gantt
Adds support for viewing the Gantt view in a "Dynamic" mode.<br/>
This dynamic mode allows any user to configure how many days in the past and how many days into the future they want to see on the Gantt view.<br/>
This is configurable per user under the user it's own preferences. A sample of the Dynamic Gantt mode for holidays:
![image](https://user-images.githubusercontent.com/6352350/132712311-92477dbb-09ff-4c2e-ad2d-135f7dcadf7c.png)

This module works on default Gantt views (such as the one in Time off), however it will not automatically work on all Gantt views (for example under tasks).
In this case you will need to add `dynamic` to the `scales` and add the `precision` `'dynamic': 'day:full'`. A sample piece of code:
```
<?xml version="1.0" encoding="utf-8" ?>
<odoo>
    <data>
        <!-- Inherit planning gantt view -->
        <record id="view_planning_slot_gantt_inherit" model="ir.ui.view">
            <field name="name">planning.slot.inherit.view.gantt</field>
            <field name="model">planning.slot</field>
            <field name="inherit_id" ref="planning.planning_view_gantt" />
            <field name="arch" type="xml">
                <!-- Add additional scales and precision value for gantt view -->
                <xpath expr="//gantt" position="attributes">
                    <attribute name="scales">day,week,month,year,dynamic</attribute>
                    <attribute
                        name="precision"
                    >{'day': 'hour:full', 'week': 'day:full', 'month': 'day:full', 'year': 'day:full', 'dynamic': 'day:full'}</attribute>
                </xpath>
            </field>
        </record>
    </data>
</odoo>
```

## dynamic_gantt_planning
Adds support for the dynamic view mode on the planning app.<br/>
Since this view was heavily customized in the planning app we had to write a custom extension to allow this:<br/>
![image](https://user-images.githubusercontent.com/6352350/132718002-d0dd353c-99dc-4e88-a4a8-aae93f49f676.png)

## planning_week_number
Shows the week number in the Gantt view when looking at the day, week or month view:
![image](https://user-images.githubusercontent.com/6352350/139200100-f16df608-df6f-45f7-aad0-f720425eb36a.png)
