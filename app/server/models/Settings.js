var mongoose = require('mongoose');

var START_DATE = Date.parse(process.env.START_DATE);
var END_DATE = Date.parse(process.env.END_DATE);
var REG_START_DATE = process.env.REG_START_DATE ? Date.parse(process.env.REG_START_DATE) : Date.now();
var REG_END_DATE = Date.parse(process.env.REG_END_DATE);
var REG_CONF_DATE = Date.parse(process.env.REG_CONF_DATE);

/**
 * Settings Schema!
 *
 * Fields with select: false are not public.
 * These can be retrieved in controller methods.
 *
 * @type {mongoose}
 */
var schema = new mongoose.Schema({
  status: String,
  timeOpen: {
    type: Number,
    default: REG_START_DATE
  },
  timeClose: {
    type: Number,
    default: REG_END_DATE
  },
  timeConfirm: {
    type: Number,
    default: REG_CONF_DATE
  },
  hackStart: {
    type: Number,
    default: START_DATE
  },
  hackEnd: {
    type: Number,
    default: END_DATE
  },
  whitelistedEmails: {
    type: [String],
    select: false,
    // default: ['.edu'],
    default: []
  },
  waitlistText: {
    type: String
  },
  acceptanceText: {
    type: String,
  },
  confirmationText: {
    type: String
  },
  allowMinors: {
    type: Boolean
  }
});

/**
 * Get the list of whitelisted emails.
 * Whitelist emails are by default not included in settings.
 * @param  {Function} callback args(err, emails)
 */
schema.statics.getWhitelistedEmails = function(callback){
  this
    .findOne({})
    .select('whitelistedEmails')
    .exec(function(err, settings){
      return callback(err, settings.whitelistedEmails);
    });
};

/**
 * Get the open and close time for registration.
 * @param  {Function} callback args(err, times : {timeOpen, timeClose, timeConfirm})
 */
schema.statics.getRegistrationTimes = function(callback){
  this
    .findOne({})
    .select('timeOpen timeClose timeConfirm')
    .exec(function(err, settings){
      callback(err, {
        timeOpen: settings.timeOpen,
        timeClose: settings.timeClose,
        timeConfirm: settings.timeConfirm,
        hackStart: settings.hackStart,
        hackEnd: settings.hackEnd
      });
    });
};

schema.statics.getPublicSettings = function(callback){
  this
    .findOne({})
    .exec(callback);
};

module.exports = mongoose.model('Settings', schema);
