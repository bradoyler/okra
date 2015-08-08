var express = require('express');
var router = express.Router();
var data = require('../services/data');

/* GET home page. */
function isUrl(url) {
    var _url = url || '';
    return _url.match(/(http|https):\/\//);
}

router.get('/', function (req, res) {
    data.getTests(25, function (tests) {
        res.render('index', {tests:tests});
    });
});

router.get('/runs', function (req, res) {
    data.getTestRuns(25, function (testruns) {
        var passed = testruns.filter(function (item) {
            return (item.status=='success');
        }).length;
        var failed = testruns.filter(function (item) {
            return (item.status=='fail');
        }).length;

        res.render('runs', {testruns:testruns, passed:passed, failed:failed});
    });
});

router.get('/api/status/:baseurl', function (req, res) {

    data.getTestRunsByBaseUrl(req.params.baseurl, function (testruns) {
        var passed = testruns.filter(function (item) {
            return (item.status=='success');
        }).length;
        var failed = testruns.filter(function (item) {
            return (item.status=='fail');
        }).length;

        res.json({passed:passed, failed:failed, lastTestRun:testruns[0]});
    });
});

router.get('/api/runs', function (req, res) {
    data.getTestRuns(25, function (testruns) {
        res.json({testruns:testruns});
    });
});

router.post('/api/results', function (req, res) {
    var formData = req.body;

    data.saveTestResults(formData.results, function (savedResults) {
         res.json(savedResults);
    });
});

router.get('/test/:id', function (req, res) {
    data.getTest(req.params.id, function (test) {
        res.render('detail', test);
    });
});

router.get('/testrun/:id', function (req, res) {
    data.getTestRun(req.params.id, function (testrun) {
        res.render('testrun', testrun);
    });
});

router.get('/edit/:id', function (req, res) {
    data.getTest(req.params.id, function (test) {
        res.render('login', test);
    });
});

router.get('/new', function (req, res) {
    data.getTest('', function (test) {
        res.render('login', test);
    });
});

router.get('/run/:id', function (req, res) {
    data.getTest(req.params.id, function (test) {

        var baseUrl = test.baseUrl;
        if(isUrl(req.query.baseUrl)){
            baseUrl = req.query.baseUrl;
        }

        data.insertTestRun(test, baseUrl, function (testrun) {
            console.log('### added', testrun);
        });

        res.redirect('/runs');
    });
});

router.get('/runall', function (req, res) {

    data.getTests(25, function (tests) {

        var baseUrl = tests[0].baseUrl;
        if(isUrl(req.query.baseUrl)){
            baseUrl = req.query.baseUrl;
        }
        tests.forEach(function (test) {

            data.insertTestRun(test, baseUrl, function (testrun) {
                console.log('### added', testrun);
            });
        });

        res.redirect('/runs');
    });
});

router.get('/about', function (req, res) {
    res.render('about');
});


module.exports = router;
