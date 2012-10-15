var ScheduleView = Backbone.View.extend({
    rowTmpl: _.template('<tr><td class="time"><%= hours %>:<%= minutes %></td><% for (var day in days) { %><td><% for (var i = 0; i < days[day].length; i++) { %><div class="e<%= days[day][i].slot %>of<%= days[day][i].max %>" style="height: <%= 22 * days[day][i].length - 16 %>px;"><%= days[day][i].name %></div><% } %></td><% } %></tr>'),
    headerTmpl: _.template('<tr><td class="time">&nbsp;</td><% for (var day in days) { %><th><%= day %></th><% } %></tr>'),

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

        var html = [this.headerTmpl({days: Day.prototype.names})];

        var minutes = 5, hours = 9;

        // for each chunk slot
        for (var i = 0; i < events[0].length; i++) {
            var days = {};
            // and for each day
            for (var j = 0; j < events.length; j++) {
                var day = Day.prototype.NAMES[j];
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
                days[day] = _.map(events[j][i], function(e) {
                    return {
                        name: e.get('name'),
                        length: e.length(),
                        max: max,
                        slot: e.slot
                    };
                });
                days[day].cnt = events[j][i].eventCount;
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


var SelectorView = Backbone.View.extend({
    optionTmpl: _.template('<option value="<%= key %>"><%= key %></option>'),

    tagName: 'select',

    initialize: function(options) {
        this.schedules = options.schedules;
        this.vent = options.vent;

        this.$el.on('change', function() {
            this.vent.trigger('schedule:change', this.schedules.get(this.$el.val()));
        }.bind(this));

        this.vent.on('init', function() {
            var schedule = _.chain(this.schedules).pairs().first().first().value();
            this.vent.trigger('schedule:change', this.schedules.get(schedule));
        }.bind(this));
    },

    render: function() {
        var html = _.map(this.schedules, function(v, k) {
            return this.optionTmpl({value: v, key: k});
        }.bind(this));
        console.log(html);
        $(this.el).html(html.join(''));
    }
});

var merge = function() {
    return _.reduce(arguments, function(s, teacher) {
        return s.merge(teacher.schedule());
    }, Marjorie.schedule());
}

var schedules = {
    pyne: [Pyne],
    purdum: [Purdum],
    pynePhillips: [Pyne, Phillips],
    seashorePyne: [Seashore, Pyne],
    burton: [Burton],
    franzke: [Franzke],
    garStar: [Gardenhire, Starkovich],
    defazio: [Defazio],
    defAdamek: [Defazio, Adamek],
    cutNguGar: [CutLund, Nguyen, Gardenhire],
    flagelKing: [Flagel, King],
    burPyne: [Burton, Pyne],
    cutLund: [CutLund],
    carCav: [CarCav],
    daley: [Daley]
    };

schedules.get = function(key) {
    console.log(this, key, this[key]);
    if (_.isArray(this[key])) {
        console.log('merging');
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