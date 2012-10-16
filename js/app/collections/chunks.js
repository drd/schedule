define(['backbone', 'app/constants', 'app/models/chunk'], function(Backbone, Constants, Chunk) {

    var Chunks = Backbone.Collection.extend({

        model: Chunk,
        numChunks: Constants.RANGE.minutes() / Chunk.prototype.length

    }, {
        // Chunks.makeDay
        makeDay: function(day) {
            var dayChunks = new Chunks();
            _.times(Chunks.prototype.numChunks, function(i) {
                dayChunks.add(new Chunk({day: day, index: i}));
            });

            return dayChunks;
        }
    });

    return Chunks;
});
