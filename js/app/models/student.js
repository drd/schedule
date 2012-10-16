define(['backbone'], function(Backbone) {
    var Student = Model.extend({

        attrs: ['name', 'initials', 'grade', 'teacher', 'isEll'],

        schedule: function() {
                var teacherSchedule = this.get('teacher').schedule(),
            ninaSchedule = Nina.scheduleFor(this);

            return teacherSchedule.merge(ninaSchedule);
        }

    });

    return Student;
});