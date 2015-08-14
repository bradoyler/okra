var request = require('request');
var localData = require('../testData');

function getTest(id, callback) {
    localData.getTest(id, callback);
}

function getTests(limit, callback) {
    callback(localData.tests);
}

function getTestRun(id, callback) {
    localData.getTestRun(id, callback);
}

function createTestRun(test, baseUrl) {
    var testRun = JSON.parse(JSON.stringify(test));
    testRun.testId = test.id;
    testRun.baseUrl = baseUrl;
    testRun.errMsg = '';
    testRun.id = test.id +'-'+ new Date().getTime();
    testRun.createdAt = new Date();
    testRun.runAt = '';
    testRun.status = 'queued';
    testRun.results = [];
    return testRun;
}

function getTestRunsByBaseUrl(baseUrl, callback) {
    var testRunsByBaseUrl = localData.testRuns.filter(function (testrun) {
        return (testrun.baseUrl.indexOf(baseUrl) > -1);
    });
    callback(testRunsByBaseUrl);
}

function getTestRuns(limit, callback) {
    callback(localData.testRuns);
}

function updateTestWithResults(testrun, results) {
    getTest(testrun.testId, function (test) {

        test.status = 'success';
        test.errMsg = '';
        test.runAt = new Date();
        test.lastRunId = testrun.id;

        var firstFail = results.filter(function (result) {
            return (result.success === 'false');
        })[0];

        if(firstFail) {
            test.status = 'fail';
            test.errMsg = 'on ('+ firstFail.type +') of: '+ firstFail.value;
        }
    });
}

function saveTestResults(results, callback) {

    getTestRun(results[0].testRunId, function (testrun) {

        if (testrun) {
            testrun.results.push(results);
            if(testrun.status !== 'fail') {
                testrun.status = 'success';
            }
            testrun.runAt = new Date();

            var firstFail = results.filter(function (result) {
                return (result.success === 'false');
            })[0];

            if(firstFail) {
                testrun.status = 'fail';
                testrun.errMsg = 'on ('+ firstFail.type +') of: '+ firstFail.value;
            }

            updateTestWithResults(testrun, results);
            callback(results);
        }
        else {
            console.log('### ERR saveTestResults:', testrun);
        }
    });
}

function insertTestRun(test, baseUrl, callback) {
    var testRun = createTestRun(test, baseUrl);
    localData.testRuns.unshift(testRun);
    callback(testRun);
}

function appName() {
    return localData.appName || 'none';
}

function Data() {
    var self =  this;
    if(process.env.TESTDATA_URL) {
        request(process.env.TESTDATA_URL, function (error, resp, body) {
            var data = JSON.parse(body);
            localData.appName = data.appName;
            localData.tests = data.tests;
        });
    }
}

var data = new Data();
data.appName = appName;
data.getTest = getTest;
data.getTests = getTests;
data.getTestRun = getTestRun;
data.getTestRuns = getTestRuns;
data.insertTestRun = insertTestRun;
data.saveTestResults = saveTestResults;
data.getTestRunsByBaseUrl = getTestRunsByBaseUrl;

module.exports = data;
