var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * referred to:http://arshaw.com/fullcalendar/docs/event_data/Event_Object/
 */
var Event = mongoose.model('event', {
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