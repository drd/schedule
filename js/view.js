var ScheduleView = Backbone.View.extend({
    rowTmpl: _.template('<tr><td class="time"><%= hours %>:<%= minutes %></td><% for (var day in days) { %><td><% for (var i = 0; i < days[day].length; i++) { %><div class="e<%= days[day][i].slot %>of<%= days[day][i].max %>" style="height: <%= 22 * days[day][i].length - 16 %>px;"><%= days[day][i].name %></div><% } %></td><% } %></tr>'),
    headerTmpl: _.template('<tr><td class="time">&nbsp;</td><% for (var day in days) { %><th><%= day %></th><% } %></tr>'),

    initialize: function(options) {
        this.schedule = options.schedule;
    },

    render: function() {
        var events = this.schedule.get('days').map(function(day) {
            return day.allEvents();
        }.bind(this));

        var html = [this.headerTmpl({days: Day.prototype.names})];

        var minutes = 5, hours = 9;

        // for each chunk slot
        for (var i = 0; i < events[0].length; i++) {
            var days = {};
            // and for each day
            for (var j = 0; j < events.length; j++) {
                var day = Day.prototype.NAMES[j];
                // look at each event
                _.each(events[j][i], function(e) {
                    e.slot = 1;
                    // find the first available slot
                    while (events[j][i].slots[e.slot]) {
                        e.slot++;
                    }
                    events[j][i].slots[e.slot] = e;

                    // find the maximum number of events it shares a slot with
                    var max = events[j][i].eventCount;
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
                    e.max = max;

                });
                // find all the events in this chunk that aren't hidden
                days[day] = _.map(events[j][i], function(e) {
                    return {
                        name: e.get('name'),
                        length: e.length(),
                        max: e.max,
                        slot: e.slot
                    };
                });
            }

            html.push(this.rowTmpl({
                days: days,
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

var scheduleView = new ScheduleView({el: $('#schedule')});


var merge = function() {
    return _.reduce(arguments, function(s, teacher) {
        return s.merge(teacher.schedule());
    }, Marjorie.schedule());
}

// var pyne = merge(Pyne);
// var purdum = merge(Purdum);
// var pynePhillips = merge(Pyne, Phillips);
// var seashorePyne = merge(Seashore, Pyne);
// var burton = merge(Burton);
// var franzke = merge(Franzke);
// var garStar = merge(Gardenhire, Starkovich);
// var defazio = merge(Defazio);
// var defAdamek = merge(Defazio, Adamek);
// var cutNguGar = merge(CutLund, Nguyen, Gardenhire);
// var flagelKing = merge(Flagel, King);
var burPyne = merge(Burton, Pyne);
// var cutLund = merge(CutLund);
// var carCav = merge(CarCav);
// var daley = merge(Daley);


scheduleView.schedule = burPyne;
scheduleView.render();