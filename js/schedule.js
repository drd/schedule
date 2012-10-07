
var Model = Backbone.Model;
var Collection = Backbone.Collection;

var Chunk = Model.extend({

    initialize: function(options) {
        this.set('events', options.events || []);
    },

    merge: function(that) {
        var uniqEvents = _.uniq(this.get('events').concat(that.get('events')));
        return new Chunk({events: uniqEvents});
    }
});


var Block = Model.extend({

    numChunks: 6,

    makeChunks: function() {
        var chunks = [];
        _(this.numChunks).times(function(i) {
            chunks.push(new Chunk({
                index: i,
                block: this
            }));
        }.bind(this));
        return chunks;
    },

    initialize: function(options) {
        this.set('day', options.day);
        this.set('chunks', options.chunks || this.makeChunks());
        this.set('index', options.index);
    },

    merge: function(that) {
        var merged = new Block({day: this.get('day'), index: this.get('index')});

        _.each(_.zip(this.get('chunks'), that.get('chunks')), function(chunks, index) {
            var thisChunk = chunks[0],
                thatChunk = chunks[1];
            merged.get('chunks')[index] = thisChunk.merge(thatChunk);
        });

        return merged;
    }
});

var EmptyDay = Collection.extend({
    model: Block,
    numBlocks: 12
});

var SchoolDay = EmptyDay.extend({

    initialize: function(models, options) {
        this.day = options.day;
        _(this.numBlocks).times(function(i) {
            console.log('adding block', i, 'to', this.day.get('name'), this.length);
            this.add(new Block({
                day: this.day,
                index: i
            }));
        }.bind(this));
    }
});


var Day = Model.extend({

    NAMES: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],

    initialize: function(options) {
        this.set('schedule', options.schedule);
        this.set('blocks', options.blocks || new SchoolDay(null, {day: this}));
    },

    merge: function(that, into) {
        var merged = new Day({schedule: this.get('schedule'), blocks: new EmptyDay()});

        _.each(_.zip(this.get('blocks').models, that.get('blocks').models), function(blocks, index) {
            var thisBlock = blocks[0],
                thatBlock = blocks[1];
            merged.get('blocks').add(thisBlock.merge(thatBlock));
        });

        return merged;
    }
});


var Schedule = Model.extend({

    initialize: function(options) {
        _.each(Day.prototype.NAMES, function(name) {
            console.log('adding', name);
            this.set(name, new Day({name: name, schedule: this}));
            this.on('change:' + name, function(evt, schedule, day) {
                //day.set('schedule', schedule);
            });
        }.bind(this));
    },

    merge: function(that) {
        var merged = new Schedule();

        _.each(Day.prototype.NAMES, function(day) {
            var thisDay = this.get(day),
                thatDay = that.get(day);
            merged.set(day, thisDay.merge(thatDay));
        }.bind(this));

        return merged;
    }

});


var Grade = Model.extend({

    attrs: ['name', 'schedule']

});

var ERC = new Grade({name: 'ERC'});
var SLP = new Grade({name: 'SLP'});


var Teacher = Model.extend({

    attrs: ['name', 'grade', 'schedule'],

    schedule: function() {
        var gradeSchedule = this.get('grade').get('schedule'),
            schedule = this.get('schedule');

        return gradeSchedule.merge(schedule);
    }

});

var Nina = new Teacher({name: 'Nina', grade: ERC});
var Marjorie = new Teacher({name: 'Marjorie', grade: SLP});


var Student = Model.extend({

    attrs: ['name', 'initials', 'grade', 'teacher', 'isEll'],

    schedule: function() {
        var teacherSchedule = this.get('teacher').schedule(),
            ninaSchedule = Nina.scheduleFor(this);

        return teacherSchedule.merge(ninaSchedule);
    }

});


var Group = Model.extend({

    attrs: ['students']

});


var Event = Model.extend({

    attrs: ['group', 'teacher', 'grade', 'name', 'start', 'stop', 'days']

});

