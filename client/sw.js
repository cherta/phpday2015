importScripts('scripts/serviceworker-cache-polyfill.js');

var VERSION = "1";

var ASSETS_CACHE = 'php-day-2015-agenda';
var GRAVATAR_CACHE = 'php-day-2015-agenda-gravatar';
var TALKS_CACHE = 'php-day-2105-agenda-talks';

var urlsToCache = [
  '/',
  '/app.js',
  '/images/icons/chrome-touch-icon-192x192.png',
  '/images/icons/touch-icon-ipad.png',
  '/images/icons/touch-icon-iphone-retina.png',
  '/images/icons/touch-icon-ipad-retina.png',
  '/images/icons/ms-touch-icon-144x144-precomposed.png',
  'images/talks/d3.png',
  'images/talks/sms.jpg',
  'images/talks/agents.png',
  'images/talks/react.png',
  'images/talks/redes.jpeg',
  'images/talks/unicorn.jpg',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v7/2fcrYFNaTjcS6g4U3t-Y5UEw0lE80llgEseQY3FEmqw.woff2',
  'https://fonts.gstatic.com/s/materialicons/v7/2fcrYFNaTjcS6g4U3t-Y5UEw0lE80llgEseQY3FEmqw.woff2',
  '/material-design-lite/material.min.css',
  '/styles/app.css',
  '/material-design-lite/material.min.js',
  '/scripts/serviceworker-cache-polyfill.js'
];

self.addEventListener('install', function (event) {
  // Cache all known urls we will need
  event.waitUntil(
    caches.open(ASSETS_CACHE).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  var requestURL = new URL(event.request.url);
  if(requestURL.hostname === 'gravatar.com') { //Avatars retrieved from gravatar
    event.respondWith(retrieveFromAndDoCache(event.request, GRAVATAR_CACHE));
  } else if (requestURL.pathname.indexOf('/talks') === 0) { //Talks json data retrieved from the same host we serve the app
    event.respondWith(retrieveFromAndDoCache(event.request, TALKS_CACHE));
  } else { //Everything else
    event.respondWith(retrieveFromButDoNotCache(event.request));
  }
});

self.addEventListener('activate', function(event) {

  var cacheWhitelist = [ASSETS_CACHE, GRAVATAR_CACHE];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

function retrieveFromButDoNotCache(request) {
  console.debug('Trying to get: ', request.url);
  return caches.match(request).then(function(response) {
    console.debug('Cache retrieved: ', response, ' for the request: ', request);
    if (response) {
      console.debug('Cache found :)');
      return response;
    }

    console.debug('No cache :( Fetching from the Intrnet');
    return fetch(request);
  });
}

function retrieveFromAndDoCache(request, cacheName) {
  console.debug('Trying to get: ', request.url);
  return caches.match(request).then(function (response) {
    console.debug('Cache retrieved: ', response, ' for the request: ', request);
    if (response) {
      console.debug('Cache found :)');
      return response;
    }

    console.debug('No cache :(');
    var fetchRequest = request.clone();
    console.debug('Cloning and fetching from the Internet');

    return fetch(fetchRequest).then(function (response) {
      console.debug('Retrieved: ', response, 'for the request: ', fetchRequest);
      // if(!response || response.status !== 200 || response.type !== 'basic') {
      //   console.debug('Bad response, nothing to cache. Response was: ', response, ':(');
      //   return response;
      // }

      console.debug('Good response :)', response);
      var responseToCache = response.clone();

      console.debug('Cloning response to add to cache: ', responseToCache);
      caches.open(cacheName).then(function (cache) {
        cache.put(request, responseToCache);
        console.debug('Stored the request: ', request, ' in the cache: ', cache, 'the response: ', responseToCache);
      });

      return response;

    }).catch(function (e) {
      console.log('Fetch could not load the request: ', request, ' instead of ', e);
      return new Response(null, {status: 404});
    });
  });
}
