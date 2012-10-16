define(['backbone'], function(Backbone) {
    var Chunk = Backbone.Model.extend({

        length: 5,

        initialize: function(options) {
            this.set('events', options.events || []);
        },

        merge: function(that) {
            var uniqEvents = _.uniq(this.get('events').concat(that.get('events')));
            return new Chunk({events: uniqEvents});
        },

        insert: function(event) {
            if (_.indexOf(this.get('events'), event) === -1) {
                this.get('events').push(event);
            }
        },

        // TODO: remove, just use get('time')
        time: function() {
            return this.get('time');
        }

    });

    return Chunk;
});