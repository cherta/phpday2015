var reqwest = require('reqwest');

module.exports = {
  talks: function () {
    return reqwest('/talks');
  },
  talk: function (id) {
    return reqwest('/talks/' + id);
  }
};
