var moment = require('moment');

exports.ifEqual = function(val, test, options) {

    if(typeof test === 'undefined'){
        return options.inverse(this);
    }

    if(typeof test === 'number' || typeof test === 'boolean') {
        if(val===test){
            return options.fn(this);
        }
        else {
            return options.inverse(this);
        }
    }

    var arrTest = test.split('||');

    for (var i = 0; i < arrTest.length; i++) {
        if (val === arrTest[i]) {
            return options.fn(this);
        }
    }
    return options.inverse(this);
};

exports.formatdate = function(datevalue) {
    return moment.utc(datevalue).fromNow(true);
};

exports.isodate = function (datevalue) {
    return moment(datevalue).toISOString(); // see: http://momentjs.com/docs/#/displaying/as-iso-string/
};

exports.dateformat = function(datevalue, format) {
    return moment(datevalue).format(format); // see: http://momentjs.com/docs/#/displaying/format/
};

// A helper to render JSON data in the view templates
// Usage: {{{ jsonstring object }}}
exports.jsonstring = function(obj) {
    obj = obj || {};
    return JSON.stringify(obj);
};
