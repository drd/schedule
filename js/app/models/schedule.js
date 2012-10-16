define(['backbone', 'app/collections/days', 'app/collections/week'], function(Backbone, Days, Week) {
    var Schedule = Backbone.Model.extend({

        initialize: function(options) {
            options = options || {};
            this._mapping = {};
            this._mapDay = _.bind(this._mapDay, this);

            this.set('days', options.days || new Week(null, {schedule: this}));
            this.get('days').on('add', this._mapDay);
        },

        _mapDay: function(day) {
            day.set('schedule', this);
            this._mapping[day.get('name')] = day;
        },

        merge: function(that) {
            var merged = new Schedule({days: new Days()});

            this.get('days').each(function(thisDay, i) {
                var thatDay = that.get('days').at(i);
                merged.get('days').add(thisDay.merge(thatDay));
            });

            return merged;
        },

        insert: function(event) {
            _.each(event.get('days'), function(day) {
                this._mapping[day].insert(event);
            }.bind(this));
        }

    });

    return Schedule;
});
