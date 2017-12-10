// Change see to see logs in tests
const ENABLE_CONSOLE_LOGGER = true;

const bunyan = require('bunyan');

const loggerFactory = require('../src/util/logger/factory');
const consoleLoggerFactory = require('./unit/util/logger/consoleLogger');
const consoleLogger = consoleLoggerFactory();

loggerFactory.setLevel(bunyan.DEBUG);

const consoleStreamDef = {
    name: 'console',
    type: 'stream',
    stream: consoleLogger.stream
};

if (ENABLE_CONSOLE_LOGGER) {
    loggerFactory.registerStream(consoleStreamDef);
}
