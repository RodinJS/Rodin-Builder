module.exports = exports = function pagedFindPlugin(schema) {
    schema.statics.pagedFind = function (options, cb) {
        var thisSchema = this;

        if (!options.filters) {
            options.filters = {};
        }

        if (!options.keys) {
            options.keys = '';
        }

        if (!options.limit) {
            options.limit = 20;
        }

        if (!options.page) {
            options.page = 1;
        }

        if (!options.sort) {
            options.sort = {};
        }

        if (!options.population) {
            options.population = {};
        }

        var output = {
            data: null,
            pages: {
                current: options.page,
                prev: 0,
                hasPrev: false,
                next: 0,
                hasNext: false,
                total: 0
            },
            items: {
                begin: ((options.page * options.limit) - options.limit) + 1,
                end: options.page * options.limit,
                total: 0
            }
        };

        var countResults = function (callback) {
            thisSchema.count(options.filters, function (err, count) {
                output.items.total = count;
                callback(null, 'done counting');
            });
        };

        var getResults = function (callback) {
            var query = thisSchema.find(options.filters, options.keys);
            if (options.population.criteria) {
                options.population.model = options.population.model || '';
                query = thisSchema.find(options.filters, options.keys).populate(options.population.criteria, options.population.fields, options.population.model);
            }
            query.skip((options.page - 1) * options.limit);
            query.limit(options.limit);
            query.sort(options.sort);
            query.exec(function (err, results) {
                if (err) {
                    return callback(err);
                }
                output.data = results;
                callback(null, 'done getting records');
            });
        };

        require('async').parallel([
                countResults,
                getResults
            ],
            function (err, results) {
                if (err) {
                    cb(err, null);
                }

                output.pages.total = Math.ceil(output.items.total / options.limit);
                output.pages.next = ((output.pages.current + 1) > output.pages.total ? 0 : output.pages.current + 1);
                output.pages.hasNext = (output.pages.next !== 0);
                output.pages.prev = output.pages.current - 1;
                output.pages.hasPrev = (output.pages.prev !== 0);
                if (output.items.end > output.items.total) {
                    output.items.end = output.items.total;
                }

                cb(null, output);
            });
    };
};