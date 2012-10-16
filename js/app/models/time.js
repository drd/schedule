define(['backbone', 'app/constants'], function(Backbone, Constants) {
    var Time = Backbone.Model.extend({

        initialize: function(options) {
            this.set('_time',
                     options.hours * 60 +
                     options.minutes);
        },

        // new Time().chunkIndex
        chunkIndex: function() {
            var delta = this.get('_time') - Constants.START.get('_time');
            return Math.floor(delta / Constants.CHUNK_LENGTH);
        }

    }, {
        // Time.create
        create: function(hours, minutes) {
            // only handles up to 59 "extra" minutes
            if (minutes >= 60) {
                minutes -= 60;
                hours++;
            }
            // handle the afternoon scenario
            if (hours < 9) {
                hours += 12;
            }
            return new Time({hours: hours, minutes: minutes});
        },

        // Time.fromIndex
        fromIndex: function(index) {
            var minutes = index * Constants.CHUNK_LENGTH;
            var hours = Math.floor(minutes / 60);
            minutes %= 60;

            return Time.create(hours + Constants.START.get('hours'),
                               minutes + Constants.START.get('minutes'));
        }
    });

    Constants.START = Time.create(Constants.START[0], Constants.START[1]);
    Constants.END = Time.create(Constants.END[0], Constants.END[1]);

    return Time;
});