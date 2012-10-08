var ScheduleView = Backbone.View.extend({
    rowTmpl: _.template('<tr><td><%= hours > 12 ? hours - 12 : hours %>:<%= minutes %></td><% for (var day in days) { %><td><%= days[day] %></td><% } %></tr>'),
    headerTmpl: _.template('<tr><td>&nbsp;</td><% for (var day in days) { %><th><%= day %></th><% } %></tr>'),

    initialize: function(options) {
        this.schedule = options.schedule;
    },

    render: function() {
        var events = _.map(Day.prototype.NAMES, function(day) {
            return this.schedule.get(day).allEvents();
        }.bind(this));

        var html = [this.headerTmpl({days: Day.prototype.names})];

        var minutes = 5, hours = 9;

        for (var i = 0; i < events[0].length; i++) {
            var days = {};
            for (var j = 0; j < events.length; j++) {
                days[Day.prototype.NAMES[j]] = events[j][i].join(', ');
            }

            html.push(this.rowTmpl({
                days: days,
                minutes: minutes < 10 ? '0' + minutes : minutes,
                hours: hours
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

var scheduleView = new ScheduleView({el: $('table')});


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
// var burPyne = merge(Burton, Pyne);
// var cutLund = merge(CutLund);
// var carCav = merge(CarCav);
// var daley = merge(Daley);


scheduleView.schedule = burton;
scheduleView.render();