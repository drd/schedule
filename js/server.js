var jquery = require('jquery');
var jsdom = require('jsdom');
var requirejs = require('requirejs');

var document = jsdom.jsdom();
var window = document.createWindow();

var express = require('express');
var app = express();

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

requirejs(['app/views/schedule', 'app/data'], function(sv, data) {
    var schedule = new sv({
        schedule: data.Marjorie.schedule(),
        vent: { on: function() {} }
    });
    app.get('/', function(req, res) {
        schedule.render();
        res.send(schedule.el.innerHTML);
    });
});

app.listen(3141);