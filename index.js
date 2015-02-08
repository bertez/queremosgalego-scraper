var fs = require('fs');

var Twit = require('twit');

var config = fs.existsSync('./local.config.js') ? require('./local.config.js') : require('./config.js');
var T = new Twit(config.oauth);

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TweetsSchema = new Schema({
	tweet: {}
});

mongoose.model("TweetsSchema", TweetsSchema);

var tweetsModel = mongoose.model("TweetsSchema", "tweets");

mongoose.connect("mongodb://localhost/queremos");

console.log('Init process');
console.log(config);

function addTweet(tweet) {
	var t = new tweetsModel();
	t.tweet = tweet;

	t.tweet.created_at = new Date(tweet.created_at);

	t.save(function(err) {
		if (err) {
			console.log(err)
			return;
		};

		console.log("Added to db:", tweet.id, t.tweet.created_at);
	});

};

var stream = T.stream('statuses/filter', { track: config.track });

stream.on('tweet', function (tweet) {
	addTweet(tweet);
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
