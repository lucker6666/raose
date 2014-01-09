var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

/**
 * referred to:http://arshaw.com/fullcalendar/docs/event_data/Event_Object/
 */

var CalendarScheme = Schema({
    //id: String,
    title: String,
    allDay: Boolean,
    start: Date,
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