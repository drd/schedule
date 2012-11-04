require(
    [
        'jquery',
        'app/data',
        'app/views/schedule',
        'app/views/selector'
    ],
    function($, data, ScheduleView, SelectorView) {
        var merge = function() {
            return _.reduce(arguments, function(s, teacher) {
                return s.merge(teacher.schedule());
            }, data.Marjorie.schedule());
        };

        var schedules = {
            pyne: [data.Pyne],
            purdum: [data.Purdum],
            pynePhillips: [data.Pyne, data.Phillips],
            seashorePyne: [data.Seashore, data.Pyne],
            burton: [data.Burton],
            franzke: [data.Franzke],
            garStar: [data.Gardenhire, data.Starkovich],
            defazio: [data.Defazio],
            defAdamek: [data.Defazio, data.Adamek],
            cutNguGar: [data.CutLund, data.Nguyen, data.Gardenhire],
            flagelKing: [data.Flagel, data.King],
            burPyne: [data.Burton, data.Pyne],
            cutLund: [data.CutLund],
            carCav: [data.CarCav],
            daley: [data.Daley]
        };

        schedules.get = function(key) {
            if (_.isArray(this[key])) {
                this[key] = merge.apply(null, this[key]);
            }
            return this[key];
        };

        var vent = _.extend({}, Backbone.Events);

        var scheduleView = new ScheduleView({el: $('#schedule'),
                                             vent: vent});


        var selectorView = new SelectorView({el: $('#selector'),
                                             vent: vent,
                                             schedules: schedules});
        selectorView.render();

        vent.trigger('init');
    });