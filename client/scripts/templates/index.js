var fs = require('fs');
var Handlebars = require('handlebars');
var layouts = require('handlebars-layouts');

// Register helpers
Handlebars.registerHelper(layouts(Handlebars));
// Register partials
Handlebars.registerPartial('layout', fs.readFileSync(__dirname + '/layout.hbs', 'utf8'));

let loadingTemplate = fs.readFileSync(__dirname + '/loading.hbs', 'utf-8');
let talkTemplate = fs.readFileSync(__dirname + '/talk.hbs', 'utf-8');
let talksTemplate = fs.readFileSync(__dirname + '/talks.hbs', 'utf-8');
let locationTemplate = fs.readFileSync(__dirname + '/location.hbs', 'utf-8');
let directionsTemplate = fs.readFileSync(__dirname + '/directions.hbs', 'utf-8');
let errorTemplate = fs.readFileSync(__dirname + '/error.hbs', 'utf-8');

module.exports = {
  loading: Handlebars.compile(loadingTemplate),
  talk: Handlebars.compile(talkTemplate),
  talks: Handlebars.compile(talksTemplate),
  location: Handlebars.compile(locationTemplate),
  directions: Handlebars.compile(directionsTemplate),
  error:  Handlebars.compile(errorTemplate)
};
