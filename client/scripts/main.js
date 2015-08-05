var page = require('page');
var talkFunctions = require('./utils/talks');
var geolocation = require('./utils/geolocation');
var templates = require('./templates');

var appContainer = document.getElementById('app');
var map = null;

page.base('');

page('/', stopTrackingPosition, function talks () {
  draw(loadingDOM())
  talkFunctions.talks().then(talksDOM).then(draw);
});

page('/talks/:id', stopTrackingPosition, function talk (ctx) {
  draw(loadingDOM())
  talkFunctions.talk(ctx.params.id).then(talkDOM).then(draw);
});

page('/location', stopTrackingPosition, function location () {
  draw(loadingDOM());
  draw(templates.location());

  requestAnimationFrame(function loadGeolocation () {
    map = geolocation.load();
  });
});

page('/location/directions', stopTrackingPosition, function location () {
  draw(loadingDOM());
  draw(templates.directions());

  requestAnimationFrame(function loadGeolocation () {
    map = geolocation.load();
    geolocation.showDirections(map);
  });
});

page({hashbang: true});

function stopTrackingPosition (ctx, next) {
  geolocation.stopTrackingPosition();
  next();
}

function draw (html) {
  requestAnimationFrame(function redraw() {
    appContainer.innerHTML = html;
    componentHandler.upgradeDom();
  });
}

function loadingDOM () {
  return templates.loading();
}

function talksDOM (talks) {
  return templates.talks({talks: talks});
}

function talkDOM (talk) {
  var personNames = talk.people.map(function (person) {
    return person.name;
  });
  var twitterHandles = talk.people.map(function (person) {
    return '@' + person.twitter;
  }).join(' & ');
  talk.twitterHandles = twitterHandles;
  return templates.talk(talk);
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function(registration) {
    // Registration was successful
    if(registration.installing) {
      console.log('Service worker installing');
    } else if(registration.waiting) {
      console.log('Service worker installed');
    } else if(registration.active) {
      console.log('Service worker active');
    }
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}
