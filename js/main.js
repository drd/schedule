require([
    'jquery',
    'app/data',
    'app/views/schedule',
    'app/views/selector'
], function(
    $,
    data,
    ScheduleView,
    SelectorView
) {
    var vent = _.extend({}, Backbone.Events);

    var scheduleView = new ScheduleView({el: $('#schedule'),
                                         vent: vent,
                                         schedules: data.groups});


    var selectorView = new SelectorView({el: $('#selector'),
                                         vent: vent,
                                         schedules: data.groups});

    vent.trigger('init');
});