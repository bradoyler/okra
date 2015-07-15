var request = require('request');
var resTestApi = process.env.API_BASE_URL || 'http://localhost:3000';

function TestRunner() {}

function runTests(tests) {
    tests.forEach(function (test) {
        if(test.status==='new'){
            console.log('### run:', test.name, test.id);
            runTest(test);
        }
    });
}

function runAssertions(response, test) {

    var assertions = test.assertions;

    assertions.forEach(function (assertion) { //console.log('## assertion', assertion, response.statusCode);
        assertion.testRunId = test.id;
        assertion.testPath = response.req.path;

        if (response.req.path !== assertion)
            if (assertion.type === 'statusCode') {
                assertion.success = (response.statusCode.toString() === assertion.value);
            }
            else if (assertion.type === 'html') { //console.log('## json', decodeURI(assertion.value));
                assertion.success = (response.body.indexOf(decodeURI(assertion.value)) > -1);
            }
    });
    return assertions;
}

function testSegment(test, segment, callback) {
    request(test.baseUrl + segment, function (error, response, body) {

        if (error) {
            callback(error, []); return;
        }

        var assertionResults = runAssertions(response, test);
        callback(null, assertionResults);
    });
}

function runTest(test) {

    test.urlSegments.forEach(function (segment) {
        testSegment(test, segment, function (error, results) {
            if(error) {
                return console.error('### test ERR for:'+ test.baseUrl + segment, error);
            }

            console.log('!### saving testresults for:', test.baseUrl + segment);
            logResults(results);
        });
    });
}

function logResults(results, callback) {
    var formData = {results: results}; // must be KV pair
    request.post({url: resTestApi +'/api/results', form: formData}, function(error, httpResponse, body) {
        if (error || httpResponse.statusCode !== 200) {
            console.error('##### ERR', error, httpResponse.statusCode, body);
        }
    });
}

function getTestRunsFromApi(url, callback) {
    request(url +'/api/runs', function (error, resp, body) {
        if(error) {
            callback(url +' - '+ error); return;
        }
        callback(null, JSON.parse(body));
    });
}

TestRunner.prototype.runTest = runTest;

TestRunner.prototype.runTests = runTests;

TestRunner.prototype.getTestRunsFromApi = getTestRunsFromApi;

var testRunner = new TestRunner();

module.exports = testRunner;
