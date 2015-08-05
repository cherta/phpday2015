importScripts('scripts/serviceworker-cache-polyfill.js');

var ASSETS_CACHE = 'php-day-2015-agenda';
var IMAGES_CACHE = 'php-day-2015-agenda-images';

var urlsToCache = [
  '/',
  '/app.js',
  '/images/icons/chrome-touch-icon-192x192.png',
  '/images/icons/touch-icon-ipad.png',
  '/images/icons/touch-icon-iphone-retina.png',
  '/images/icons/touch-icon-ipad-retina.png',
  '/images/icons/ms-touch-icon-144x144-precomposed.png',
  '//fonts.googleapis.com/icon?family=Material+Icons',
  '//fonts.gstatic.com/s/materialicons/v7/2fcrYFNaTjcS6g4U3t-Y5UEw0lE80llgEseQY3FEmqw.woff2',
  '//fonts.gstatic.com/s/materialicons/v7/2fcrYFNaTjcS6g4U3t-Y5UEw0lE80llgEseQY3FEmqw.woff2',
  '/styles/app.css',
  '/material-design-lite/material.min.js'
];

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(ASSETS_CACHE)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// self.onactivate = function(event) {
//   console.log(event)
// }

self.addEventListener('fetch', function(event) {
  var requestURL = new URL(event.request.url);
  if(requestURL.hostname == 'gravatar.com') {
    event.respondWith(imageURL(event.request));
  } else {
    event.respondWith(
      caches
        .match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }

          return fetch(event.request);
        }
      )
    );
  }
});

function imageURL(request) {
  return caches
    .match(request)
    .then(function(response) {
      if (response) { return response; }

      return fetch(request)
        .then(function(response) {
          caches.open(IMAGES_CACHE).then(function(cache) {
            cache.put(request, response);
          });

      return response.clone();
    });
  });
}
