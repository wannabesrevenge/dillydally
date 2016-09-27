var Job = require('./job.js'),
    jobQueue = [];

function addJob() {
    var job = new Job(arguments),
        jobPromise; 
    
    jobPromise = new module.exports.Promise(function(resolve, reject) {
        job.init(resolve, reject);
        addToQueue(job);
    });

    return jobPromise;
}

function addToQueue(job) {
    jobQueue.push(job);

    // No jobs are running, let's start this one immediately
    if(jobQueue.length === 1) {
        nextJob();
    }
}

function removeFirstJob() {
    jobQueue.shift();
}

function nextJob() {
    var job = jobQueue[0];

    if(!job) { return; };

    job.runJob(function finishJob() {
        removeFirstJob();
        nextJob();
    });
}

// This is our API
// Allow users to provide their own Promise implementation
module.exports = {
    addJob: addJob,
    Promise: Promise
};
