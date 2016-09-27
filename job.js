function Job(args) {
    // Declaring values for readability
    this.options;
    this.func;
    this.resolve;
    this.reject;

    // Default values
    this.args = [].slice.call(args);
    this.context = Object.create(null);
    this.delay = 0;

    // Let's check if the user gives any options
    if(typeof this.args[0] !== 'function') { this.options = this.args.shift(); }

    // The first ele in the array MUST be a function here
    this.func = this.args.shift();
    if(typeof this.func !== 'function') {
        throw new Error('You must provide a function to the constructor as one of the first two arguments.');
    }

    // Let's parse the options if the user gave us any
    if(typeof this.options === 'number') {
        this.delay = this.options;
    } else if(typeof this.options === 'object') {
        this.delay = this.options.delay || this.delay;
        this.context = this.options.context || this.context;
    }
}

Job.prototype.init = function initJob(resolve, reject) {
    this.resolve = resolve;
    this.reject = reject;
};

Job.prototype.runJob = function runJob(callback) {
    function runningJob() {
        var result = this.func.apply(this.context, this.args);

        if(result && typeof result.then === 'function') {
            // This job is a promise
            result.then(this.resolve, this.reject);
        } else {
            this.resolve(result);
        }

        callback();
    };

    setTimeout(runningJob.bind(this), this.delay);
}

module.exports = Job;
