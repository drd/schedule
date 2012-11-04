# TODO

## UX
- add click/drag handlers for creating/moving events
- add touch handlers for same on mobile
- allow user to create new schedule combos and save to dropdown
- make the user's own events 'sticky' (what does this mean?)
- color code events by what they are/who owns them

## Server
- write a REST API to provide a backing store

## Tech
- use BB.Marionette views
- profile
- write a SelectorView template
- allow logins (via janrain?) & store events etc by user

## Data model
- are chunks necessary except for in the view?
-- if not, a schedule could just be a collection of events, which are then mapped into chunks by the ScheduleView


# TODONE

## Server
- can now run the backbone app in node/express to generate html

## Tech
- AMD-ified
- switched to handlebars for (most) templates
