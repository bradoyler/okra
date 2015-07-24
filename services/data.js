var localData = require('../testData');

localData.getTest = function (id, callback) {
    var test = localData.tests.filter(function (test) {
        return (test.id === id);
    })[0];

    if (test) {
        callback(test); return;
    }

    callback(localData.tests[0]);
};

localData.getTestRun = function (id, callback) {

    var tr = localData.testRuns.filter(function (tr) {
        return (tr.id === id);
    })[0];

    if (tr) {
        callback(tr); return;
    }

    callback(localData.testRuns[0]);
};

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

function getTest(id, callback) {
    localData.getTest(id, callback);
}

function getTests(limit, callback) {
    callback(localData.tests);
}

function getTestRun(id, callback) {
    localData.getTestRun(id, callback);
}

function getTestRuns(limit, callback) {
    callback(localData.testRuns);
}

function updateTestWithResults(testrun, results) {
    localData.getTest(testrun.testId, function (test) {

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

    localData.getTestRun(results[0].testRunId, function (testrun) {

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

module.exports.appName = localData.appName;
module.exports.getTest = getTest;
module.exports.getTests = getTests;
module.exports.getTestRun = getTestRun;
module.exports.getTestRuns = getTestRuns;
module.exports.insertTestRun = insertTestRun;
module.exports.saveTestResults = saveTestResults;
