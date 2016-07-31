var moment = require('moment')

exports.ifEqual = function (val, test, options) {
  if (typeof test === 'undefined') {
    return options.inverse(this)
  }

  if (typeof test === 'number' || typeof test === 'boolean') {
    if (val === test) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  }

  var arrTest = test.split('||')

  for (var i = 0; i < arrTest.length; i++) {
    if (val === arrTest[ i ]) {
      return options.fn(this)
    }
  }
  return options.inverse(this)
}

exports.formatdate = function (datevalue) {
  return moment.utc(datevalue).fromNow(true)
}

exports.isodate = function (datevalue) {
  return moment(datevalue).toISOString() // see: http://momentjs.com/docs/#/displaying/as-iso-string/
}

exports.dateformat = function (datevalue, format) {
  return moment(datevalue).format(format) // see: http://momentjs.com/docs/#/displaying/format/
}

// A helper to render JSON data in the view templates
// Usage: {{{ jsonstring object }}}
exports.jsonstring = function (obj) {
  obj = obj || {}
  return JSON.stringify(obj)
}

// usage: {{#eachSlice items 1 5}} like array.slice(1,5)
exports.eachSlice = function (context, offset, limit) {
  if (context instanceof Array) {
    var options = arguments[ arguments.length - 1 ]
    var ret = ''
    var collection = context.slice(offset, limit)
    collection.forEach(function (item) {
      ret += options.fn(item)
    })
    return ret
  } else {
    return ''
  }
}

// usage: {{#ifEqual val 'test'}}
exports.ifEqual = function (val, test, options) {
  if (typeof test === 'undefined') {
    return options.inverse(this)
  }

  // @bradoyler - should this just be if( typeof test != 'string' ) - evann
  if (typeof test === 'number' || typeof test === 'boolean') {
    if (val === test) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  }

  var arrTest = test.split('||')

  for (var i = 0; i < arrTest.length; i++) {
    if (val === arrTest[ i ]) {
      return options.fn(this)
    }
  }
  return options.inverse(this)
}
