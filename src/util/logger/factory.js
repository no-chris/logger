/**
 * "fatal" (60): The service/app is going to stop or become unusable now. An operator should definitely look into this soon.
 * "error" (50): Fatal for a particular request, but the service/app continues servicing other requests. An operator should look at this soon(ish).
 * "warn" (40): A note on something that should probably be looked at by an operator eventually.
 * "info" (30): Detail on regular operation.
 * "debug" (20): Anything else, i.e. too verbose to be included in "info" level.
 * "trace" (10): Logging from external libraries used by your app or very detailed application logging.
 */
const _ = require('lodash');
const bunyan = require('bunyan');

let logger;

let defaultLevel = bunyan.INFO;

const defaultConfig = {
    src: false
};

const allStreams = [];

/**
 * Merge registered streams with streams given in the loggerFactory call.
 * Add default level if not specified.
 */
function getStreams(userStreams = []) {
    const mergedStreams = (_.isArray(userStreams)) ? allStreams.concat(userStreams) : allStreams;
    return mergedStreams.map(stream => {
        if (! stream.level) {
            stream.level = defaultLevel;
        }
        return stream;
    });
}

/**
 * @param {String} name - logger name
 * @param {Object} userConfig - see options description on {@link https://github.com/trentm/node-bunyan}
 */
function loggerFactory(name, userConfig = {}) {
    if (!name) {
        throw new TypeError('A logger should have a name');
    }
    if (!logger) {
        const config = _.assign(
            defaultConfig,
            { level: defaultLevel },
            userConfig,
            {
                name: 'immoLogger',
                streams: getStreams(userConfig.streams)
            }
        );
        logger = bunyan.createLogger(config);
    }

    return logger.child({ module: name });
}

loggerFactory.setLevel = function setLevel(level) {
    defaultLevel = level;
};

loggerFactory.getLevel = function getLevel() {
    return defaultLevel;
};

loggerFactory.reset = function reset() {
    logger = null;
};

loggerFactory.FATAL = bunyan.FATAL;
loggerFactory.ERROR = bunyan.ERROR;
loggerFactory.WARN  = bunyan.WARN;
loggerFactory.INFO  = bunyan.INFO;
loggerFactory.DEBUG = bunyan.DEBUG;
loggerFactory.TRACE = bunyan.TRACE;

/**
 * @param {Object} stream - see options description on {@link https://github.com/trentm/node-bunyan}
 */
loggerFactory.registerStream = function registerStream(stream) {
    allStreams.push(stream);
};

module.exports = loggerFactory;