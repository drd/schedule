define([
    'backbone',
    'app/models/day',
    'hbs!app/templates/header',
    'hbs!app/templates/row'
], function(Backbone, Day, headerTmpl, rowTmpl) {
    var ScheduleView = Backbone.View.extend({
        // rowTmpl: _.template('<tr><td class="time"><%= hours %>:<%= minutes %></td><% for (var day in days) { %><td><% for (var i = 0; i < days[day].length; i++) { %><div class="e<%= days[day][i].slot %>of<%= days[day][i].max %>" style="height: <%= 22 * days[day][i].length - 16 %>px;"><%= days[day][i].name %></div><% } %></td><% } %></tr>'),
        // headerTmpl: _.template('<tr><td class="time">&nbsp;</td><% for (var day in days) { %><th><%= day %></th><% } %></tr>'),

        initialize: function(options) {
            this.schedule = options.schedule;
            this.vent = options.vent;
            this.vent.on('schedule:change', function(schedule) {
                this.schedule = schedule;
                this.render();
            }.bind(this));
        },

        // sets up some bookkeeping properties for rendering
        allEvents: function(day) {
            return day.get('chunks').map(function(chunk) {
                var events = chunk.get('events');
                events.eventCount = events.length;
                events.slots = {};
                return events;
            });
        },

        render: function() {
            var events = this.schedule.get('days').map(function(day) {
                return this.allEvents(day);
            }.bind(this));

            var html = [headerTmpl({days: Day.NAMES})];

            var minutes = 5, hours = 9;

            // for each chunk slot
            for (var i = 0; i < events[0].length; i++) {
                var days = [];
                // and for each day
                for (var j = 0; j < events.length; j++) {
                    var day = Day.NAMES[j];
                    // find the maximum number of events it shares a slot with
                    var max = events[j][i].eventCount;
                    // look at each event
                    _.each(events[j][i], function(e) {
                        e.slot = 1;
                        // find the first available slot
                        while (events[j][i].slots[e.slot]) {
                            e.slot++;
                        }
                        events[j][i].slots[e.slot] = e;

                        for (var k = 0; k < e.length(); k++) {
                            if (k > 0) {
                                // mark this slot as filled
                                events[j][i + k].slots[e.slot] = e;

                                // and bump the eventCount / check the max
                                if (++events[j][i + k].eventCount > max) {
                                    max = events[j][i + k].eventCount;
                                }
                            }
                        }
                    });
                    var d = _.map(events[j][i], function(e) {
                        return {
                            name: e.get('name'),
                            length: e.length(),
                            height: e.length() * 22 - 16,
                            max: max,
                            slot: e.slot,
                            schedule: e.get('scheduleName')
                        };
                    });
                    d.cnt = events[j][i].eventCount;
                    days.push(d);
                }

                html.push(rowTmpl({
                    days: _.values(days),
                    minutes: minutes < 10 ? '0' + minutes : minutes,
                    hours: hours > 12 ? hours - 12 : hours
                }));

                minutes += 5;
                if (minutes == 60) {
                    minutes = 0;
                    hours++;
                }
            }

            $(this.el).html(html.join(''));
        }
    });

    return ScheduleView;
});