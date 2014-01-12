var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

/**
 * referred to:http://arshaw.com/fullcalendar/docs/event_data/Event_Object/
 */

var CalendarScheme = Schema({
    created_at:{
      type:Date,
      default:Date.now
    },
    created_by:{
       type: Schema.Types.ObjectId,
       ref: 'User'
    },
    //id: String,
    title: {
      type:String,
      required:true
    },
    allDay: Boolean,
    start: {
      type:Date,
      required:true
    },
    end: Date,
    url: String,
    className: String,
    editable: Boolean,
    startEditable: Boolean,
    durationEditable: Boolean,
    source: Object,
    color: String,
    backgroundColor: String,
    borderColor: String,
    textColor: String
});

var Calendar = mongoose.model('calendar', CalendarScheme);

module.exports = Calendar;