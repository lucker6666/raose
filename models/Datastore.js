var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;
var DataStore = mongoose.model('datastore', {
    type: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    data: {
      type: Schema.Types.Mixed,
      required: true
    }
});

module.exports = DataStore;