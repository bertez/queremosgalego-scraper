var fs = require('fs');

var Twit = require('twit');

var config = fs.existsSync('./local.config.js') ? require('./local.config.js') : require('./config.js');

var T = new Twit(config.oauth);

console.log('Init process');
console.log(config);

var stream = T.stream('statuses/filter', { track: config.track });

stream.on('tweet', function (tweet) {
  console.log('GOT TWEET', tweet.text);
});

stream.on('limit', function (limitMessage) {
  console.log('LIMIT:', limitMessage);
});

stream.on('disconnect', function (disconnectMessage) {
  console.log('DISCONNECT:', disconnectMessage);
  console.log('Exiting');

  //Exit so supervisor can reload the process
  process.exit(1);
});