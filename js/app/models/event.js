define(['backbone', 'app/models/time', 'app/models/range'], function(Backbone, Time, Range) {
    var Event = Backbone.Model.extend({

        attrs: ['group', 'teacher', 'grade', 'name', 'start', 'stop', 'days'],

        initialize: function(options) {
            if (!_.isArray(options.days)) {
                this.set('days', [options.days]);
            }

            this.set('range', new Range({start: options.start, end: options.end}));
        },

        length: function() {
            return this.get('range').chunkLength();
        }

    }, {
        // Event.create
        create: function(e, day) {
            return new Event({
                name: e[0],
                start: Time.create(e[1][0], e[1][1]),
                end: Time.create(e[2][0], e[2][1]),
                days: day
            });
        }
    });

    return Event;
});