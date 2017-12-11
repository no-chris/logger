// Change see to see logs in tests
const ENABLE_CONSOLE_LOGGER = true;

const loggerFactory = require('../src/util/logger/factory');
const consoleLoggerFactory = require('../src/util/logger/consoleLogger');
const consoleLogger = consoleLoggerFactory();

loggerFactory.setLevel(loggerFactory.DEBUG);

const consoleStreamDef = {
    name: 'console',
    type: 'raw',
    stream: consoleLogger.stream
};

if (ENABLE_CONSOLE_LOGGER) {
    loggerFactory.registerStream(consoleStreamDef);
}
