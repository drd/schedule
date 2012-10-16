define(['backbone'], function(Backbone) {
    var SelectorView = Backbone.View.extend({
        optionTmpl: _.template('<option value="<%= key %>"><%= key %></option>'),

        tagName: 'select',

        initialize: function(options) {
            this.schedules = options.schedules;
            this.vent = options.vent;

            this.$el.on('change', function() {
                this.vent.trigger('schedule:change', this.schedules.get(this.$el.val()));
            }.bind(this));

            this.vent.on('init', function() {
                var schedule = _.chain(this.schedules).pairs().first().first().value();
                this.vent.trigger('schedule:change', this.schedules.get(schedule));
            }.bind(this));
        },

        render: function() {
            var html = _.map(this.schedules, function(v, k) {
                return this.optionTmpl({value: v, key: k});
            }.bind(this));
            console.log(html);
            $(this.el).html(html.join(''));
        }
    });

    return SelectorView;
});