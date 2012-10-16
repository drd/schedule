define(['backbone', 'app/models/schedule'], function(Backbone, Schedule) {
    var Teacher = Backbone.Model.extend({

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

    return Teacher;
});
