define(['backbone', 'app/constants', 'app/models/time'], function(Backbone, Constants, Time) {
    var Range = Backbone.Model.extend({

        startChunk: function(block) {
            return this.get('start').chunkIndex();
        },

        endChunk: function(block) {
            return this.get('end').chunkIndex() - 1;
        },

        chunkLength: function() {
            return this.endChunk() - this.startChunk() + 1;
        },

        minutes: function() {
                var start = this.get('start'),
            end = this.get('end');

            return (end.get('hours') - start.get('hours')) * 60 +
                end.get('minutes') - start.get('minutes');
        }

    }, {

        // Range.makeRange
        create: function(start, end) {
            return new Range({start: start, end: end});
        }

    });

    Constants.RANGE = Range.create(Constants.START, Constants.END);

    return Range;
});
