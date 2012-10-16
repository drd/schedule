define(['backbone', 'app/models/schedule'], function(Backbone, Schedule) {
    var Grade = Backbone.Model.extend({

        attrs: ['name', 'schedule'],

        initialize: function() {
            this.set('schedule', new Schedule());
        }

    });

    Grade.ERC = new Grade({name: 'ERC'});
    Grade.SLP = new Grade({name: 'SLP'});

    return Grade;
});