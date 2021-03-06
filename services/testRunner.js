var request = require('request')
var resTestApi = process.env.API_BASE_URL || 'http://localhost:3000'

function TestRunner (_resTestApi) {
  if (!(this instanceof TestRunner)) {
    return new TestRunner(_resTestApi)
  }

  if (_resTestApi) {
    resTestApi = _resTestApi
  }
}

function runTests (tests) {
  tests.forEach(function (test) {
    if (test.status === 'queued') {
      console.log('### run:', test.name, test.id)
      runTest(test)
    }
  })
}

function getAssertionResults (response, test) {
  var assertions = test.assertions

  assertions.forEach(function (assertion) {
    // console.log('## assertion', assertion, response.statusCode);
    assertion.testRunId = test.id
    assertion.success = false

    if (response) {
      assertion.testPath = response.req.path

      if (response.req.path !== assertion) {
        if (assertion.type === 'statusCode') {
          assertion.success = (response.statusCode.toString() === assertion.value)
        } else if (assertion.type === 'html') {
          assertion.success = (response.body.indexOf(decodeURI(assertion.value)) > -1)
        } else if (assertion.type === 'json') {
          // todo: use json-assert or jsonschema
          assertion.success = (response.body.indexOf(decodeURI(assertion.value)) > -1)
        }
      }
    }
  })
  return assertions // results
}

function testSegment (test, segment, callback) {
  request(test.baseUrl + segment, function (error, response, body) {
    if (error) {
      console.error('### testSegment ERROR')
    }

    var assertionResults = getAssertionResults(response, test)
    callback(assertionResults)
  })
}

function runTest (test) {
  test.urlSegments.forEach(function (segment) {
    testSegment(test, segment, function (results) {
      console.log('### saving testresults for:', test.baseUrl + segment)
      logResults(results)
    })
  })
}

function logResults (results, callback) {
  var formData = { results: results } // must be KV pair
  request.post({ url: resTestApi + '/api/results', form: formData }, function (error, httpResponse, body) {
    if (error) {
      return console.error('##### ERR', error)
    }

    if (httpResponse.statusCode !== 200) {
      return console.error('##### statusCode', httpResponse.statusCode)
    }
  })
}

function getTestRunsFromApi (url, callback) {
  request(url + '/api/runs', function (error, resp, body) {
    if (error) {
      return callback(url + ' - ' + error)
    }
    callback(null, JSON.parse(body))
  })
}

TestRunner.prototype.runTest = runTest

TestRunner.prototype.runTests = runTests

TestRunner.prototype.getTestRunsFromApi = getTestRunsFromApi

module.exports = TestRunner
