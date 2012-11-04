define([
    'backbone'
], function(
    Backbone
) {
    var SelectorView = Backbone.View.extend({
        optionTmpl: _.template(
            '<option <%= selected %> value="<%= key %>"><%= key %></option>'
        ),

        tagName: 'select',

        initialize: function(options) {
            this.schedules = options.schedules;
            this.selected = this.$el.val();
            this.vent = options.vent;

            this.$el.on('change', function() {
                this.vent.trigger('schedule:change', this.$el.val());
            }.bind(this));

            this.vent.on('init', function() {
                if (this.$el.val() == this.selected) {
                    return;
                }
                this.vent.trigger('schedule:change', this.$el.val());
            }.bind(this));

            this.vent.on('schedule:change', function(name) {
                this.selected = name;
                this.render();
            }.bind(this));
        },

        render: function() {
            console.log('selector:render', this.selected);
            var html = _.map(this.schedules, function(v, k) {
                if (k == 'get') return '';
                return this.optionTmpl({
                    value: v,
                    key: k,
                    selected: k == this.selected ? 'selected' : ''
                });
            }.bind(this));
            this.el.innerHTML = html.join('');
        }
    });

    return SelectorView;
});