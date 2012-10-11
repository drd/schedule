
var Model = Backbone.Model;
var Collection = Backbone.Collection;


var Time = Model.extend({

    initialize: function(options) {
        this.set('_time',
                options.hours * 60 +
                options.minutes);
    },

    // new Time().chunkIndex
    chunkIndex: function() {
        var delta = this.get('_time') - Day.START.get('_time');
        return Math.floor(delta / 5);
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
            var minutes = index * Chunk.prototype.length;
        var hours = Math.floor(minutes / 60);
        minutes %= 60;

        return Time.create(hours + Day.START.get('hours'),
                           minutes + Day.START.get('minutes'));
    }
});


var Range = Model.extend({

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
    makeRange: function(start, end) {
        return new Range({start: start, end: end});
    }

});


var Day = Model.extend({

    NAMES: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],

    START: Time.create(9, 05),
    END: Time.create(15, 15),

    initialize: function(options) {
        this.set('schedule', options.schedule);
        this.set('chunks', options.chunks || Chunks.makeDay(this));
    },

    merge: function(that, into) {
        var merged = new Day({schedule: this.get('schedule'), chunks: new Chunks({day: null})}),
            thatChunks = that.get('chunks');

        // TODO: use _.each()'s index parameter to avoid this whackness
        this.get('chunks').each(function(thisChunk, index) {
            var thatChunk = thatChunks.at(index);
            merged.get('chunks').add(thisChunk.merge(thatChunk));
        });

        return merged;
    },

    insert: function(event) {
        this.get('chunks').at(event.get('range').startChunk()).insert(event);
    },

    // allEvents is a helper that sets up some bookkeeping
    // properties for the ScheduleView, consider moving it there
    allEvents: function() {
        return this.get('chunks').map(function(chunk) {
            var events = chunk.get('events');
            events.eventCount = events.length;
            events.slots = {};
            return events;
        });
    }
});

Day.START = Day.prototype.START;
Day.END = Day.prototype.END;
Day.RANGE = Range.makeRange(Day.START, Day.END);


var Chunk = Model.extend({

    length: 5,

    initialize: function(options) {
        this.set('events', options.events || []);
        this.set('time', Time.fromIndex(options.index));
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


var Chunks = Collection.extend({

    model: Chunk,
    numChunks: Day.RANGE.minutes() / Chunk.prototype.length

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


var Schedule = Model.extend({

    initialize: function(options) {
        _.each(Day.prototype.NAMES, function(name) {
            this.set(name, new Day({name: name, schedule: this}));
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
    },

    insert: function(event) {
        _.each(event.get('days'), function(day) {
            this.get(day).insert(event);
        }.bind(this));
    }

});


var Grade = Model.extend({

    attrs: ['name', 'schedule'],

    initialize: function() {
        this.set('schedule', new Schedule());
    }

});

var ERC = new Grade({name: 'ERC'});
var SLP = new Grade({name: 'SLP'});


var Teacher = Model.extend({

    attrs: ['name', 'grade', 'schedule'],

    initialize: function() {
        this.set('schedule', new Schedule());
    },

    schedule: function() {
        var gradeSchedule = this.get('grade').get('schedule'),
            schedule = this.get('schedule');

        return gradeSchedule.merge(schedule);
    }

});


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

    attrs: ['group', 'teacher', 'grade', 'name', 'start', 'stop', 'days'],

    initialize: function(options) {
        if (!_.isArray(options.days)) {
            this.set('days', [options.days]);
        }

        this.set('range', new Range({start: options.start, end: options.end}));
    },

    length: function() {
        return this.get('range').chunkLength();
    }

}, {
    // Event.create
    create: function(e, day) {
        return new Event({
            name: e[0],
            start: Time.create(e[1][0], e[1][1]),
            end: Time.create(e[2][0], e[2][1]),
            days: day
        });
    }
});