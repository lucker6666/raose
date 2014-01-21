var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;
var DataStore = mongoose.model('datastore', {
    type: {
      type: String,
      required: true
    },
    // data bucket
    bucket: {
      type: String,
      required: true
    },
    // data date 
    date: {
      type: Date,
      required: true
    },
    // data
    data: {
      type: Schema.Types.Mixed,
      required: true
    }
});

module.exports = DataStore;