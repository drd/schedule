
var Model = Backbone.Model;
var Collection = Backbone.Collection;


var Time = Model.extend({

    initialize: function() {
        var mAdjusted = this.get('minutes') - 5,
            hAdjusted = this.get('hours');

        if (mAdjusted < 0) {
            mAdjusted += 60;
            hAdjusted--;
        }

        this.set('_hours', hAdjusted);
        this.set('_minutes', mAdjusted);
    },

    blockIndex: function() {
        var hIndex = this.get('_hours') - Day.prototype.START.get('_hours'),
            mIndex = this.get('_minutes') >= 30 ? 1 : 0;

        return hIndex * 2 + mIndex;
    },

    chunkIndex: function() {
        return Math.floor(this.get('_minutes') % 30 / 5);
    }
});

Time.create = function(hours, minutes) {
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
};


var Range = Model.extend({

    startBlock: function() {
        return this.get('start').blockIndex();
    },

    startChunk: function(block) {
        var startChunk = this.get('start').chunkIndex();
        if (block && block != this.startBlock()) {
            startChunk = 0;
        }
        return startChunk;
    },

    endBlock: function() {
        var endBlock = this.get('end').blockIndex();
        if (this.get('end').chunkIndex() == 0) {
            endBlock--;
        }

        return endBlock;
    },

    endChunk: function(block) {
        var endChunk = this.get('end').chunkIndex() - 1;
        if (endChunk == -1 || (block && block != this.endBlock())) {
            endChunk = Block.prototype.numChunks - 1;
        }

        return endChunk;
    },

    chunkLength: function() {
        return (this.endBlock() - this.startBlock()) * Block.prototype.numChunks +
            this.endChunk() - this.startChunk() + 1;
    }
});


var Chunk = Model.extend({

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

    time: function() {
        var hours = this.get('block').index / 2;
        var minutes = this.get('index') * 5;

        if (Math.floor(hours) < hours) {
            hours = Math.floor(hours);
            minutes += 30;
        }

        var start = Time.create(Day.prototype.START.get(hours) + hours,
                                Day.prototype.START.get(minutes) + minutes);

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
    },

    insert: function(event) {
        var range = event.get('range');
        var start = range.startChunk(this.get('index'));
        var end = range.endChunk(this.get('index'));

        // console.log('inserting', event, 'into chunks', start, 'through', end);

        for (var i = start; i <= end; i++) {
            // console.log('inserting', event, 'into chunk', i, this.get('chunks')[i]);
            this.get('chunks')[i].insert(event);
        }
    }
});


var EmptyDay = Collection.extend({
    model: Block,
    numBlocks: 13
});

var SchoolDay = EmptyDay.extend({

    initialize: function(models, options) {
        this.day = options.day;
        _(this.numBlocks).times(function(i) {
            this.add(new Block({
                day: this.day,
                index: i
            }));
        }.bind(this));
    }
});


var Day = Model.extend({

    NAMES: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],

    START: Time.create(9, 05),

    END: Time.create(15, 05),

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
    },

    insert: function(event) {
        var range = event.get('range');

        // console.log('inserting', event, 'into blocks', range.startBlock(), 'through', range.endBlock());

        for (var i = range.startBlock(); i <= range.endBlock(); i++) {
            this.get('blocks').at(i).insert(event);
        }
    },

    allEvents: function() {
        var blocks = this.get('blocks').map(function(block) {
            return _.map(block.get('chunks'), function(chunk) {
                return chunk.get('events');
            });
        });

        return _(blocks).reduce(function(chunks, b) { return chunks.concat(b); }, []);
    }
});


var Schedule = Model.extend({

    initialize: function(options) {
        _.each(Day.prototype.NAMES, function(name) {
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
    },

    insert: function(event) {
        _.each(event.get('days'), function(day) {
            // console.log('inserting', event, 'into', day);
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

});


Event.create = function(e, day) {
    return new Event({
        name: e[0],
        start: Time.create(e[1][0], e[1][1]),
        end: Time.create(e[2][0], e[2][1]),
        days: day
    });
};