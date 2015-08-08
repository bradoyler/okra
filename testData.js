var tests = [
    {
        id: '100',
        name: 'Section (tech)', runAt: '', status: '', errMsg: '',
        baseUrl: 'http://bradoyler.github.io',
        urlSegments: ['/tech/', '/tech', '/tech/mobile', '/tech/mobile/', '/tech/gadgets'],
        assertions: [{type: 'statusCode', value: '200'}, {type: 'html', value: '<div class="panel-section'}]
    },
    {
        id: '101',
        name: 'Home page',
        baseUrl: 'http://bradoyler.github.io',
        urlSegments: ['/'],
        assertions: [{type: 'statusCode', value: '200'}, {type: 'html', value: '<h1>Bradoyler.github.io</h1>'}]
    },
    {
        id: '102',
        name: 'Article',
        baseUrl: 'http://bradoyler.github.io',
        urlSegments: ['/tech/gadgets/test-n364676'],
        assertions: [{type: 'statusCode', value: '200'}, {type: 'html', value: '<body'}]
    },
    {
        id: '103',
        name: '404 page',
        baseUrl: 'http://bradoyler.github.io',
        urlSegments: ['/404'],
        assertions: [{type: 'statusCode', value: '404'}, {type: 'html', value: '<body'}]
    },
    {
        id: '104',
        name: 'static pages',
        baseUrl: 'http://bradoyler.github.io',
        urlSegments: ['/test.html', '/pages/contact-us'],
        assertions: [{type: 'statusCode', value: '200'}, {type: 'html', value: '<body'}]
    }
];

var testRun1 = JSON.parse(JSON.stringify(tests[1]));
testRun1.testId = testRun1.id;
testRun1.id = '10112213232';
testRun1.errMsg = '';
testRun1.status = 'queued';
testRun1.results = [];
testRun1.createdAt = new Date();
testRun1.baseUrl ='http://bradoyler.github.io';

var testRuns = [testRun1];

module.exports = {tests: tests, testRuns: testRuns, appName:'My Blog'};
