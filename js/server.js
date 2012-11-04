var jquery = require('jquery');
var jsdom = require('jsdom');
var requirejs = require('requirejs');

var express = require('express');
var app = express();

app.use('/js', express.directory('js'));
app.use('/js', express.static('js'));

var fs = require('fs');
var html = fs.readFileSync('index.html').toString();
var jq = fs.readFileSync('js/lib/jquery.min.js').toString();

var window, document, $;

jsdom.env({
    html: html,
    src: [jq],
    done: function(err, win) {
        window = win;
        document = window.document;
        $ = window.jQuery;
    }
});



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


requirejs(['backbone', 'app/views/schedule', 'app/data'], function(Backbone, sv, data) {
    Backbone.setDomLibrary($);
    Backbone.View.prototype.make = function(tagName, attributes, content) {
        var el = document.createElement(tagName);
        if (attributes) $(el).attr(attributes);
        if (content) $(el).html(content);
        return el;
    };

    var schedule = new sv({
        schedule: data.Marjorie.schedule(),
        vent: { on: function() {} }
    });
    app.get('/', function(req, res) {
        schedule.render();
        res.send(document.documentElement.innerHTML);
    });
});

app.listen(3141);