define(['backbone', 'app/constants', 'app/models/range', 'app/collections/chunks'], function(Backbone, Constants, Range, Chunks) {

    var Day = Backbone.Model.extend({

        initialize: function(options) {
            this.set('schedule', options.schedule);
            this.set('chunks', options.chunks || Chunks.makeDay(this));
        },

        merge: function(that, into) {
            var merged = new Day({
                name: this.get('name'),
                schedule: this.get('schedule'),
                chunks: new Chunks(null, {day: null})
            }),
            thatChunks = that.get('chunks');

            this.get('chunks').each(function(thisChunk, index) {
                var thatChunk = thatChunks.at(index);
                merged.get('chunks').add(thisChunk.merge(thatChunk));
            });

            return merged;
        },

        insert: function(event) {
            this.get('chunks').at(event.get('range').startChunk()).insert(event);
        }
    }, Constants);

    return Day;
});