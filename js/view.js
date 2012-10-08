var ScheduleView = Backbone.View.extend({
    rowTmpl: _.template('<tr><td class="time"><%= hours %>:<%= minutes %></td><% for (var day in days) { %><td><% for (var i = 0; i < days[day].length; i++) { %><div class="e<%= days[day][i].index %>of<%= days[day][i].max %>" style="height: <%= 35 * days[day][i].length %>px;"><%= days[day][i].name %></div><% } %></td><% } %></tr>'),
    headerTmpl: _.template('<tr><td class="time">&nbsp;</td><% for (var day in days) { %><th><%= day %></th><% } %></tr>'),

    initialize: function(options) {
        this.schedule = options.schedule;
    },

    render: function() {
        var events = _.map(Day.prototype.NAMES, function(day) {
            return this.schedule.get(day).allEvents();
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
                    var assigned = {};
                    // if it hasn't been processed already
                    if (!e.hidden) {
                        e.hidden = [];
                        e.slot = 1;
                        var max = 0;
                        // find the maximum number of events it shares a slot with
                        for (var k = 0; k < e.length(); k++) {
                            if (k > 0) {
                                var l = events[j][i + k].indexOf(e);
                                // and hide it in every slot but the first
                                if (l !== -1) {
                                    events[j][i + k][l].hidden.push(i + k);
                                }
                            }

                            // keep track of which slots have been assigned
                            _.each(events[j][i+k], function(ev) {
                                if (ev != e && ev.slot) {
                                    assigned[ev.slot] = ev;
                                }
                            });

                            if (events[j][i + k].length > max) {
                                max = events[j][i + k].length;
                            }
                        }
                        e.max = max;

                        // reassign a slot if there was a collision
                        if (assigned[e.slot]) {
                            _(max).times(function(i) {
                                // assign the first available slot
                                if (!assigned[i + 1] && e.slot == 1) {
                                    e.slot = i + 1;
                                }
                            });
                        }
                    }
                });
                // find all the events in this chunk that aren't hidden
                days[day] = _.chain(events[j][i]).map(function(e) {
                    if (e.hidden.indexOf(i) !== -1) return null;
                    return {name: e.get('name'), length: e.length(), max: e.max, index: e.slot};
                }).compact().value();
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
var cutNguGar = merge(CutLund, Nguyen, Gardenhire);
// var flagelKing = merge(Flagel, King);
var burPyne = merge(Burton, Pyne);
// var cutLund = merge(CutLund);
// var carCav = merge(CarCav);
// var daley = merge(Daley);


scheduleView.schedule = burPyne;
scheduleView.render();