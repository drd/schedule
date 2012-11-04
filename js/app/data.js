define(['app/constants', 'app/models/teacher', 'app/models/grade', 'app/models/day', 'app/models/event'], function(Constants, Teacher, Grade, Day, Event) {

    var exports = {};

    var Nina = new Teacher({name: 'Nina', grade: Grade.ERC});
    var Marjorie = new Teacher({name: 'Marjorie', grade: Grade.SLP});

    var grades = {
        KG: [['I', [ 1, 35], [ 2, 05]],
             ['R', [12, 00], [ 1, 30]],
             ['E', [10, 30], [11, 00]]],

        1:  [['I', [ 2, 10], [ 2, 40]],
             ['R', [10, 30], [12, 00]],
             ['E', [ 2, 40], [ 3, 10]]],

        2:  [['I', [ 2, 45], [ 3, 15]],
             ['R', [ 9, 15], [10, 00]],
             ['R', [ 1, 30], [ 2, 15]],
             ['E', [10, 00], [10, 30]]],

        3:  [['I', [ 9, 05], [ 9, 45]],
             ['R', [10, 30], [12, 00]],
             ['E', [ 2, 10], [ 2, 40]]],

        4:  [['I', [ 9, 45], [10, 25]],
             ['R', [12, 00], [ 1, 30]],
             ['E', [ 9, 05], [ 9, 45]]],

        5:  [['I', [10, 30], [11, 00]],
             ['R', [ 1, 40], [ 3, 10]],
             ['E', [ 9, 05], [ 9, 45]]]
    };


    _(grades).each(function(events, grade) {
        var grade = this[grade] = new Grade({name: grade});
        _(events).each(function(e) {
            _(Day.NAMES).each(function(day) {
                grade.get('schedule').insert(Event.create(e, day));
            });
        });
    });


    var schedules = {
        KG: {
            Adamek: {
                Monday: [
                    ['P', [ 9, 35], [10, 05]]
                ],
                Tuesday: [
                    ['M', [ 2, 10], [ 2, 40]]
                ],
                Wednesday: [
                    ['P', [ 2, 10], [ 2, 40]]
                ],
                Thursday: [
                    ['M', [ 2, 10], [ 2, 40]],
                    ['C', [ 1, 35], [ 2, 05]]
                ],
                Friday: [
                    ['M', [ 9, 05], [ 9, 35]],
                    ['L', [ 2, 05], [ 2, 20]]
                ]
            },

            Defazio: {
                Monday: [
                    ['M', [ 9, 35], [10, 05]]
                ],
                Tuesday: [
                    ['M', [ 9, 35], [10, 05]]
                ],
                Wednesday: [
                    ['P', [ 2, 10], [ 2, 40]],
                    ['C', [ 1, 35], [ 2, 05]]
                ],
                Thursday: [
                    ['P', [ 9, 35], [10, 05]],
                    ['L', [ 1, 35], [ 1, 50]]
                ],
                Friday: [
                    ['M', [ 9, 35], [10, 05]]
                ]
            }
        },

        1: {
            CarCav: {
                Monday: [
                    ['M', [10, 05], [10, 35]],
                    ['C', [ 2, 10], [ 2, 40]]
                ],
                Tuesday: [
                    ['P', [ 1, 05], [ 1, 35]]
                ],
                Wednesday: [
                    ['M', [10, 05], [10, 35]],
                    ['L', [ 1, 50], [ 2, 05]]
                ],
                Thursday: [
                    ['P', [ 1, 05], [ 1, 35]]
                ],
                Friday: [
                    ['OL', [10, 05], [10, 35]]
                ]
            },

            Flagel: {
                Monday: [
                    ['P', [10, 05], [10, 35]]
                ],
                Tuesday: [
                    ['M', [10, 05], [10, 35]],
                    ['C', [ 2, 10], [ 2, 40]]
                ],
                Wednesday: [
                    ['P', [ 1, 05], [ 1, 35]],
                    ['L', [10, 05], [10, 20]]
                ],
                Thursday: [
                    ['M', [10, 05], [10, 35]]
                ],
                Friday: [
                    ['M', [10, 05], [10, 35]]
                ]
            },

            King: {
                Monday: [
                    ['P', [ 1, 05], [ 1, 35]]
                ],
                Tuesday: [
                    ['M', [ 1, 05], [ 1, 35]]
                ],
                Wednesday: [
                    ['P', [ 1, 05], [ 1, 35]]
                ],
                Thursday: [
                    ['M', [ 1, 05], [ 1, 35]],
                    ['C', [ 2, 10], [ 2, 40]]
                ],
                Friday: [
                    ['OL', [11, 35], [12, 05]],
                    ['L', [ 9, 20], [ 9, 35]]
                ]
            }
        },

        2: {
            Phillips: {
                Monday: [
                    ['OL', [11, 00], [11, 30]]
                ],
                Tuesday: [
                    ['OL', [11, 30], [12, 00]],
                    ['L', [10, 45], [11, 00]]
                ],
                Wednesday: [
                    ['P', [11, 35], [12, 05]],
                    ['C', [ 2, 45], [ 3, 15]]
                ],
                Thursday: [
                    ['M', [11, 05], [11, 35]]
                ],
                Friday: [
                    ['P', [11, 35], [12, 05]]
                ]
            },

            Pyne: {
                Monday: [
                    ['OL', [11, 30], [12, 00]]
                ],
                Tuesday: [
                    ['P', [11, 35], [12, 05]],
                    ['C', [ 2, 45], [ 3, 15]]
                ],
                Wednesday: [
                    ['M', [11, 35], [12, 05]]
                ],
                Thursday: [
                    ['P', [11, 35], [12, 05]],
                    ['L', [ 2, 20], [ 2, 35]]
                ],
                Friday: [
                    ['OL', [10, 35], [11, 05]]
                ]
            },

            Seashore: {
                Monday: [
                    ['P', [11, 35], [12, 05]],
                    ['L', [ 2, 20], [ 2, 35]]
                ],
                Tuesday: [
                    ['OL', [11, 00], [11, 30]]
                ],
                Wednesday: [
                    ['P', [11, 35], [12, 05]]
                ],
                Thursday: [
                    ['OL', [11, 00], [11, 30]],
                    ['C', [ 2, 45], [ 3, 15]]
                ],
                Friday: [
                    ['M', [11, 35], [12, 05]]
                ]
            }
        },

        3: {
            Gardenhire: {
                Monday: [
                    ['P',    [ 1, 35], [ 2, 05]],
                    ['Math', [ 9, 45], [10, 30]]
                ],
                Tuesday: [
                    ['P',    [ 1, 35], [ 2, 05]],
                    ['L',    [ 2, 45], [ 3, 00]],
                    ['Math', [ 9, 45], [10, 30]]
                ],
                Wednesday: [
                    ['M',    [ 1, 35], [ 2, 05]],
                    ['Math', [ 9, 45], [10, 30]]
                ],
                Thursday: [
                    ['P',    [ 1, 35], [ 2, 05]],
                    ['C',    [ 9, 10], [ 9, 40]],
                    ['Math', [ 9, 45], [10, 30]]
                ],
                Friday: [
                    ['M',    [ 2, 40], [ 3, 10]],
                    ['Math', [ 9, 45], [10, 30]]
                ]
            },

            Starkovich: {
                Monday: [
                    ['P', [ 2, 40], [ 3, 10]]
                ],
                Tuesday: [
                    ['M', [ 2, 40], [ 3, 10]],
                    ['P', [ 1, 35], [ 2, 05]],
                    ['C', [ 9, 10], [ 9, 40]]
                ],
                Wednesday: [
                    ['L', [ 2, 40], [ 2, 55]]
                ],
                Thursday: [
                    ['M', [ 2, 40], [ 3, 10]]
                ],
                Friday: [
                    ['P', [10, 05], [10, 35]]
                ]
            }
        },

        4: {
            Burton: {
                Monday: [
                    ['P', [10, 35], [11, 05]],
                    ['C', [ 9, 50], [10, 20]]
                ],
                Tuesday: [
                    ['M', [ 1, 35], [ 2, 05]]
                ],
                Wednesday: [
                    ['P', [ 1, 35], [ 2, 05]],
                    ['L', [ 9, 50], [10, 05]]
                ],
                Thursday: [
                    ['M', [ 1, 35], [ 2, 05]]
                ],
                Friday: [
                    ['P', [ 2, 10], [ 2, 40]]
                ]
            },

            Daley: {
                Monday: [
                    ['P', [10, 35], [11, 05]]
                ],
                Tuesday: [
                    ['P', [ 2, 10], [ 2, 40]],
                    ['L', [10, 20], [10, 35]]
                ],
                Wednesday: [
                    ['M', [10, 35], [11, 05]]
                ],
                Thursday: [
                    ['M', [10, 35], [11, 05]]
                ],
                Friday: [
                    ['P', [ 1, 35], [ 2, 05]]
                ]
            },

            Franzke: {
                Monday: [
                    ['M', [ 1, 35], [ 2, 05]]
                ],
                Tuesday: [
                    ['P', [10, 35], [11, 05]],
                    ['L', [ 1, 35], [ 1, 50]],
                    ['C', [ 9, 50], [10, 20]]
                ],
                Wednesday: [
                    ['P', [10, 35], [11, 05]]
                ],
                Thursday: [
                    ['P', [ 2, 10], [ 2, 40]]
                ],
                Friday: [
                    ['M', [ 1, 35], [ 2, 05]]
                ]
            }
        },

        5: {
            CutLund: {
                Monday: [
                    ['P', [11, 05], [11, 35]]
                ],
                Tuesday: [
                    ['M', [11, 05], [11, 35]],
                    ['C', [10, 30], [11, 00]]
                ],
                Wednesday: [
                    ['P', [11, 05], [11, 35]]
                ],
                Thursday: [
                    ['P', [12, 05], [12, 35]]
                ],
                Friday: [
                    ['M', [11, 05], [11, 35]]
                ]
            },

            Nguyen: {
                Monday: [
                    ['P', [12, 05], [12, 35]]
                ],
                Tuesday: [
                    ['M', [12, 05], [12, 35]]
                ],
                Wednesday: [
                    ['P', [12, 05], [12, 35]]
                ],
                Thursday: [
                    ['M', [12, 05], [12, 35]],
                    ['C', [10, 30], [11, 00]]
                ],
                Friday: [
                    ['P', [12, 05], [12, 35]]
                ]
            },

            Purdum: {
                Monday: [
                    ['M', [12, 05], [12, 35]],
                    ['C', [10, 30], [11, 00]]
                ],
                Tuesday: [
                    ['P', [12, 05], [12, 35]]
                ],
                Wednesday: [
                    ['P', [12, 05], [12, 35]]
                ],
                Thursday: [
                    ['P', [11, 05], [11, 35]]
                ],
                Friday: [
                    ['M', [12, 05], [12, 35]],
                    ['L', [ 9, 50], [10, 05]]
                ]
            }
        }
    };


    _(schedules).each(function(teachers, grade) {
        _(teachers).each(function(days, teacher) {
            var teacher = exports[teacher] = new Teacher({name: teacher, grade: this[grade]});
            _(days).each(function(events, day) {
                _(events).each(function(e) {
                    teacher.get('schedule').insert(Event.create(e, day));
                });
            });
        });
    });


    var lunch = {
        Adamek: [[11, 00], [11, 30]],
        Daley: [[11, 10], [11, 30]],
        Franzke: [[11, 10], [11, 30]],
        Defazio: [[11, 35], [11, 55]],
        Burton: [[11, 35], [11, 55]],
        Phillips: [[11, 35], [11, 55]],
            King: [[12, 05], [12, 25]],
        Pyne: [[12, 05], [12, 25]],
        Phillips: [[12, 05], [12, 25]],
        Seashore: [[12, 05], [12, 25]],
        CarCav: [[12, 30], [12, 50]],
        Flagel: [[12, 30], [12, 50]],
        Gardenhire: [[12, 30], [12, 50]],
        Starkovich: [[12, 30], [12, 50]],
        Nguyen: [[12, 50], [ 1, 10]],
        Purdum: [[12, 50], [ 1, 10]],
        CutLund: [[12, 50], [ 1, 10]]
    };

    var recess = {
        Defazio: [[11, 10], [11, 30]],
        Burton: [[11, 10], [11, 30]],
        Phillips: [[11, 35], [11, 55]],
        Adamek: [[11, 35], [11, 55]],
        Daley: [[11, 35], [11, 55]],
        Franzke: [[11, 35], [11, 55]],
        CarCav: [[12, 05], [12, 25]],
        Flagel: [[12, 05], [12, 25]],
        Gardenhire: [[12, 05], [12, 25]],
        Starkovich: [[12, 05], [12, 25]],
        King: [[12, 30], [12, 50]],
        Pyne: [[12, 30], [12, 50]],
        Phillips: [[12, 30], [12, 50]],
        Seashore: [[12, 30], [12, 50]],
        Nguyen: [[ 1, 15], [ 1, 35]],
        Purdum: [[ 1, 15], [ 1, 35]],
        CutLund: [[ 1, 15], [ 1, 35]]
    };


    _(lunch).each(function(times, teacher) {
        var teacher = exports[teacher];
        times.unshift('Lunch');
        _(Day.NAMES).each(function(day) {
            teacher.get('schedule').insert(Event.create(times, day));
        });
    });

    _(recess).each(function(times, teacher) {
        var teacher = exports[teacher];
        times.unshift('Recess');
        _(Day.NAMES).each(function(day) {
            teacher.get('schedule').insert(Event.create(times, day));
        });
    });


    var marjorieEvents = {
        Monday: [
            ['L/R Duty', [12, 35], [ 1, 45]]
        ],
        Tuesday: [
            ['Lunch', [12, 35], [12, 50]]
        ],
        Wednesday: [
            ['Late Start', [ 9, 05], [ 9, 45]],
            ['L/R Duty', [12, 35], [ 1, 45]]
        ],
        Thursday: [
            ['L/R Duty', [12, 50], [ 1, 45]]
        ],
        Friday: [
            ['IPBIS', [10, 00], [11, 00]],
            ['L/R Duty', [12, 35], [ 1, 45]]
        ]
    };

    _(marjorieEvents).each(function(events, day) {
        _(events).each(function(e) {
            Marjorie.get('schedule').insert(Event.create(e, day));
        });
    });

    exports['Marjorie'] = Marjorie;

    return exports;
});