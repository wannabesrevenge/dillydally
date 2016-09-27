var chai = require('chai'),
    sinon = require('sinon');

var assert = chai.assert,
    Job = require('./job.js'),
    queue = require('./queue.js');


describe('Job Unit Tests', function() {
    it('create a basic job', function() {
        var spy = sinon.spy();
        var job = new Job([spy]);

        assert(!spy.called, 'Job should not run until we tell it to.');
    });

    it('fail to create a basic job', function(done) {
        try {
            var job = new Job([]);
            done(new Error('Should have failed to create job with no function'));
        } catch(e) {
            done();
        };
    });

    it('run a job', function(done) {
        var spy = sinon.spy();
        var job = new Job([spy]);
        job.init(sinon.stub(), sinon.stub());
        job.runJob(function() {
            assert(spy.calledOnce, 'Job should have been called one time.');
            done();
        });
    });

    it('run a job with Number delay', function(done) {
        this.timeout(1000);
        var spy = sinon.spy();
        // Allow for max 10 ms overhead
        var job = new Job([990, spy]);
        job.init(sinon.stub(), sinon.stub());
        job.runJob(function() {
            assert(spy.calledOnce, 'Delayed job should have been called one time.');
            done();
        });
    });

    it('run a job with empty options', function(done) {
        var spy = sinon.spy();
        var job = new Job([{}, spy]);
        job.init(sinon.stub(), sinon.stub());
        job.runJob(function() {
            assert(spy.calledOnce, 'Delayed job should have been called one time.');
            done();
        });
    });

    it('run a job with delay in options', function(done) {
        this.timeout(1000);
        var spy = sinon.spy();
        // Allow for max 10 ms overhead
        var job = new Job([{delay: 990}, spy]);
        job.init(sinon.stub(), sinon.stub());
        job.runJob(function() {
            assert(spy.calledOnce, 'Delayed job should have been called one time.');
            done();
        });
    });

    it('run a job with a different context', function(done) {
        function contextFunc() {
            this.t.test;
            done();
        }

        var context = {t: {test: 'success'}};

        var job = new Job([{context: context}, contextFunc]);
        job.init(sinon.stub(), sinon.stub());
        job.runJob(sinon.stub());
    });

    it('run a job that returns a successful promise', function(done) {
        function promiseFunc() {
            return Promise.resolve();
        }

        var called = sinon.spy();
        var notCalled = sinon.spy();

        var job = new Job([promiseFunc]);
        job.init(done);
        job.runJob(sinon.stub());
    });

    it('run a job that returns a rejected promise', function(done) {
        function promiseFunc() {
            return Promise.reject();
        }

        var called = sinon.spy();
        var notCalled = sinon.spy();

        var job = new Job([promiseFunc]);
        job.init(null, done);
        job.runJob(sinon.stub());
    });
});

describe('Queue Unit Tests', function() {
    it('runs a function in the queue', function(done) {
        queue.addJob(done);
    });

    it('ensure the returned promise finishes', function(done) {
        queue.addJob(sinon.stub()).then(done);
    });

    it('runs a function in the queue with delay', function(done) {
        this.timeout(1000);
        queue.addJob(990, done);
    });

    it('runs multiple functions in the queue', function(done) {
        this.timeout(1000);
        queue.addJob(980, sinon.stub());
        queue.addJob(done);
    });

    it('run a function with a different promise lib', function(done) {
        var nativePromise = Promise,
            bbPromise = require('bluebird');

        queue.Promise = bbPromise;
        queue.addJob(sinon.stub()).then(function() {
            queue.Promise = nativePromise;
            done();
        });
    });
});
