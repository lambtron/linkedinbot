var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var LinkedInUserSchema = new mongoose.Schema({
    id: mongoose.Schema.ObjectId,
    url: String,
    viewed_at: Date
});

var LinkedInUser = mongoose.model("LinkedInUser", LinkedInUserSchema);

module.exports = {
  create: LinkedInUser,

  upsertUser: function(url) {
    var error = function(err) {
      if (err)
        throw err;
    };

    LinkedInUser.update(
      { url: url }, {$set:
        {
          viewed_at: Date.now
        }
      }, {upsert: true}, error);
  }
};
