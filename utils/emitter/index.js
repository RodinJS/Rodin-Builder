const EventEmitter = require('events').EventEmitter;

module.exports = class Emitter extends EventEmitter {
    constructor(req, res) {
        super();

        this.req = req;
        this.res = res;

        this.outcome = {
            success: true,
            data: {},
            error: {
                message: "",
                code: 0
            }
        };
    }

    /**
     * send response. Check if outcome is true send 200, else send 500 status,
     * @param err
     * @param data
     * @returns {*}
     */
    sendResponse(err, data) {
        if (err) {
            this.outcome.success = false;
            this.outcome.error = err;
        }
        if (data) {
            this.outcome.success = true;
            this.outcome.data = data;
        }

        if (this.outcome.success) {
            this.res.status(200);
            delete this.outcome.error;
            return this.res.json(this.outcome);
        } else {
            this.res.status(err.status || 500);
            delete this.outcome.data;
            return this.res.json(this.outcome);
        }
    };

    /**
     * set outcome data
     * @param key
     * @param data
     */
    setData(key, data) {
        this.outcome.success = true;
        this.outcome.data[key] = data;
    };

    /**
     * send custom error to client
     * @param err
     */
    sendError(err) {
        this.outcome.error.code = err.code || 500;
        this.sendResponse(err);
    };

    /**
     * send data to client
     * @param data
     */
    sendData(data) {
        this.sendResponse(null, data);
    }
};
