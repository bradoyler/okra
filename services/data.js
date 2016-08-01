var crypto = require('crypto')
var request = require('request')
var helpers = require('../helpers')
var localData = require('../testData')
var appData = {tests: [], testRuns: [], shasum: null}

function getTest (id, callback) {
  var test = helpers.findById(id, appData.tests)
  callback(test)
}

function getTests (limit, callback) {
  callback(appData.tests.slice(0, limit))
}

function getTestRun (id, callback) {
  var testRun = helpers.findById(id, appData.testRuns)
  callback(testRun)
}

function createTestRun (test, baseUrl) {
  var testRun = JSON.parse(JSON.stringify(test))
  testRun.testId = test.id
  testRun.baseUrl = baseUrl
  testRun.errMsg = ''
  testRun.id = test.id + '-' + new Date().getTime()
  testRun.createdAt = new Date()
  testRun.runAt = ''
  testRun.status = 'queued'
  testRun.results = []
  return testRun
}

function getTestRunsByBaseUrl (baseUrl, callback) {
  var testRunsByBaseUrl = localData.testRuns.filter(function (testrun) {
    return (testrun.baseUrl.indexOf(baseUrl) > -1)
  })
  callback(testRunsByBaseUrl)
}

function getTestRuns (limit, callback) {
  callback(appData.testRuns.slice(0, limit))
}

function updateTestWithResults (testrun, results) {
  getTest(testrun.testId, function (test) {
    test.status = 'success'
    test.errMsg = ''
    test.runAt = new Date()
    test.lastRunId = testrun.id

    var firstFail = results.filter(function (result) {
      return (result.success === 'false')
    })[ 0 ]

    if (firstFail) {
      test.status = 'fail'
      test.errMsg = 'on (' + firstFail.type + ') of: ' + firstFail.value
    }
  })
}

function saveTestResults (results, callback) {
  getTestRun(results[0].testRunId, function (testrun) {
    if (testrun) {
      testrun.results.push(results)
      if (testrun.status !== 'fail') {
        testrun.status = 'success'
      }
      testrun.runAt = new Date()

      var firstFail = results.filter(function (result) {
        return (result.success === 'false')
      })[ 0 ]

      if (firstFail) {
        testrun.status = 'fail'
        testrun.errMsg = 'on (' + firstFail.type + ') of: ' + firstFail.value
      }

      updateTestWithResults(testrun, results)
      callback(results)
    } else {
      console.log('### ERR saveTestResults:', testrun)
    }
  })
}

function insertTestRun (test, baseUrl, callback) {
  var testRun = createTestRun(test, baseUrl)
  appData.testRuns.unshift(testRun)
  callback(testRun)
}

function appName () {
  return appData.appName || 'none'
}

function initData () {
  if (process.env.TESTDATA_URL) {
    request(process.env.TESTDATA_URL, function (err, resp, body) {
      if (err) {
        console.log('>> initData ERR:', err)
        return
      }
      var data = JSON.parse(body)
      var responseSha = crypto.createHash('sha1').update(JSON.stringify(data)).digest('hex')

      console.log('>>> initData via:', process.env.TESTDATA_URL, '\n > appData.shasum:', appData.shasum, '\n > responseSha:', responseSha)

      if (responseSha !== appData.shasum) {
        appData.shasum = responseSha
        appData.appName = data.appName
        appData.tests = data.tests
      }
    })
  } else {
    appData = localData
  }
}

function Data () {
  initData()
}

var data = new Data()
data.initData = initData
data.appName = appName
data.getTest = getTest
data.getTests = getTests
data.getTestRun = getTestRun
data.getTestRuns = getTestRuns
data.insertTestRun = insertTestRun
data.saveTestResults = saveTestResults
data.getTestRunsByBaseUrl = getTestRunsByBaseUrl

module.exports = data
