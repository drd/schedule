define(['./days', 'app/models/day'], function(Days, Day) {
    var Week = Days.extend({

        initialize: function(models, options) {
            options = options || {};

            _.each(Day.NAMES, function(name) {
                var day = new Day({name: name, schedule: options.schedule});
                this.add(day);
                if (options.schedule) {
                    options.schedule._mapping[name] = day;
                }
            }.bind(this));
        }
    });

    return Week;
});
