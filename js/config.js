
var req = require.config({

    deps: ['main'],

    paths: {
        'hbs': 'lib/hbs',
        'text': 'lib/text',
        'handlebars': 'lib/handlebars-1.0.rc.1',
        'jquery': 'lib/jquery.min',
        'underscore': 'lib/underscore',
        'backbone': 'lib/backbone',
        'i18nprecompile': 'lib/i18nprecompile',
        'json2': 'lib/json2'
    },

    shim: {

        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },

        underscore: {
            exports: '_'
        }

    },

    hbs: {
        disableI18n: true,
        disableHelpers: true,
        templateExtension: 'hbs'
    }
});

