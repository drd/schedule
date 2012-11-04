var requirejs = require('requirejs');

// App Configuration

var express = require('express');
var app = express();

app.use('/js', express.directory('js'));
app.use('/js', express.static('js'));

app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});


// DOM Configuration

var jquery = require('jquery');
var jsdom = require('jsdom');

var fs = require('fs');
var html = fs.readFileSync('index.html').toString();
var jq = fs.readFileSync('js/lib/jquery.min.js').toString();


// set up our "globals"
var window, document, $;

// TODO: can this be extracted into its own AMD module,
// and then even have a 'jquery' module depend on this
// which could inject jquery into the other contexts?
jsdom.env({
    html: html,
    src: [jq],
    done: function(err, win) {
        // assign them
        window = win;
        document = window.document;
        $ = window.jQuery;
    }
});

// TODO: extract this using grunt to inject the raw object
// since apparently there is no other good way due to how r.js
// parses the file
requirejs.config({
    nodeRequire: require,
    paths: {
        hbs: 'lib/hbs',
        handlebars: 'lib/handlebars-1.0.rc.1',
        'jquery': 'lib/jquery.min',
        'underscore': 'lib/underscore',
        'backbone': 'lib/backbone',
        'i18nprecompile': 'lib/i18nprecompile',
        'json2': 'lib/json2'
    },

    shim: {
        backbone: {
            deps: ['underscore'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
        hbs: {
            deps: ['underscore']
        }
    },

    hbs: {
        disableI18n: true,
        disableHelpers: true,
        templateExtension: 'hbs'
    }
});


requirejs([
    'backbone',
    'app/views/schedule',
    'app/views/selector',
    'app/data'
], function(
    Backbone,
    ScheduleView,
    SelectorView,
    data
) {

    // use our jsdom's $
    Backbone.setDomLibrary($);

    // overwrite make() to use our jsdom's document
    Backbone.View.prototype.make = function(tagName, attributes, content) {
        var el = document.createElement(tagName);
        if (attributes) $(el).attr(attributes);
        if (content) $(el).html(content);
        return el;
    };

    // TODO: how to re-use main.js here?
    // maybe this goes into a Marionette app/initializer?
    var vent = _.extend({}, Backbone.Events);

    var scheduleView = new ScheduleView({el: $('#schedule'),
                                         vent: vent,
                                         schedules: data.groups});

    var selectorView = new SelectorView({el: $('#selector'),
                                         vent: vent,
                                         schedules: data.groups});
    selectorView.render();
    vent.trigger('init');

    app.get('/', function(req, res) {
        scheduleView.render();
        res.send(document.documentElement.innerHTML);
    });

    app.get('/schedule/:name', function(req, res) {
        vent.trigger(
            'schedule:change',
            req.param('name'));
        res.send(document.documentElement.innerHTML);
    });
});

app.listen(3141);