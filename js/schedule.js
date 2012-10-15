
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



var Days = Collection.extend({
    model: Day
});


var Week = Days.extend({

    initialize: function(models, options) {
        options = options || {};

        _.each(Day.prototype.NAMES, function(name) {
            var day = new Day({name: name, schedule: options.schedule});
            this.add(day);
            if (options.schedule) {
                options.schedule._mapping[name] = day;
            }
        }.bind(this));
    }
});

var Schedule = Model.extend({

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