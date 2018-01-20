// Change see to see logs in tests
const ENABLE_CONSOLE_LOGGER = false;

const loggerFactory = require('../src/factory');
const consoleLoggerFactory = require('../src/consoleLogger');
const consoleLogger = consoleLoggerFactory();

loggerFactory.setLevel(loggerFactory.DEBUG);

if (ENABLE_CONSOLE_LOGGER) { loggerFactory.registerStream(consoleLogger); }
