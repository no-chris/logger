// Change see to see logs in tests
const ENABLE_CONSOLE_LOGGER = true;

const loggerFactory = require('../src/factory');
const consoleLoggerFactory = require('../src/consoleLogger');
const consoleLogger = consoleLoggerFactory();

loggerFactory.setLevel(loggerFactory.TRACE);

if (ENABLE_CONSOLE_LOGGER) { loggerFactory.registerStream(consoleLogger); }
