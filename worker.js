/**
 * Created by bradoyler on 7/2/15.
 */
var CronJob = require('cron').CronJob;
var testRunner = require('./services/testRunner');
var resTestApi = process.env.API_BASE_URL || 'http://localhost:3000';
var cronInterval = process.env.CRON_INTERVAL || '*/9 * * * * *';

new CronJob(cronInterval, function(){
    console.log('## worker polled for new test -'+ new Date());

    testRunner.getTestRunsFromApi(resTestApi, function (error, data) {
        if (!error) {
            testRunner.runTests(data.testruns);
        }
        else {
            console.log('### getTestRunsFromApi() ERROR:', error);
        }
    });

}, null, true, 'America/New_York');
