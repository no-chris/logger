const { assert } = require('chai');

const loggerFactory = require('../../src/factory');
const testLoggerFactory = require('./testLogger');
const consoleLoggerFactory = require('../../src/consoleLogger');

describe('Logger', function() {
    describe('LoggerFactory', function() {
        it('requires a logger name as a constructor parameter', function() {
            loggerFactory.reset();
            assert.throw(() => loggerFactory(), TypeError);
        });

        it('should return a logger object', function() {
            loggerFactory.reset();
            const logger = loggerFactory('test');
            assert.isFunction(logger.trace, 'returned object has a trace() function');
            assert.isFunction(logger.debug, 'returned object has a debug() function');
            assert.isFunction(logger.info, 'returned object has a info() function');
            assert.isFunction(logger.warn, 'returned object has a warn() function');
            assert.isFunction(logger.error, 'returned object has a error() function');
            assert.isFunction(logger.fatal, 'returned object has a fatal() function');
        });

        it('allow to set log level', function() {
            loggerFactory.reset();
            loggerFactory.setLevel('debug');

            const testLogger = testLoggerFactory();
            const logger = loggerFactory('test', {
                streams: [{
                    type: 'stream',
                    stream: testLogger.stream,
                    level: loggerFactory.getLevel()
                }]
            });
            logger.fatal('fatal');
            logger.error('error');
            logger.warn('warn');
            logger.info('info');
            logger.debug('debug');
            logger.trace('trace');

            assert.equal(testLogger.messages.fatal.length, 1, 'fatal msg has been logged');
            assert.equal(testLogger.messages.error.length, 1, 'error msg has been logged');
            assert.equal(testLogger.messages.warn.length, 1, 'warn msg has been logged');
            assert.equal(testLogger.messages.info.length, 1, 'info msg has been logged');
            assert.equal(testLogger.messages.debug.length, 1, 'debug msg has been logged');
            assert.equal(testLogger.messages.trace.length, 0, 'no trace msg has been logged');
        });

        it('has static method to register stream', function() {
            loggerFactory.reset();
            const testLogger = testLoggerFactory();

            loggerFactory.setLevel('error');
            loggerFactory.registerStream({
                type: 'stream',
                stream: testLogger.stream
            });

            const logger = loggerFactory('test');
            logger.fatal('fatal');
            logger.error('error');
            logger.warn('warn');
            logger.info('info');
            logger.debug('debug');
            logger.trace('trace');

            assert.equal(testLogger.messages.fatal.length, 1, 'fatal msg has been logged');
            assert.equal(testLogger.messages.error.length, 1, 'error msg has been logged');
            assert.equal(testLogger.messages.warn.length, 0, 'no warn msg has been logged');
            assert.equal(testLogger.messages.info.length, 0, 'no info msg has been logged');
            assert.equal(testLogger.messages.debug.length, 0, 'no debug msg has been logged');
            assert.equal(testLogger.messages.trace.length, 0, 'no trace msg has been logged');
        });
    });

    describe('logger instance', function() {
        it('should log to specified level', function() {
            loggerFactory.reset();
            const testLogger = testLoggerFactory();
            const logger = loggerFactory('test', {
                streams: [{
                    type: 'stream',
                    stream: testLogger.stream,
                    level: 'warn'
                }]
            });
            logger.fatal('fatal');
            logger.error('error');
            logger.warn('warn');
            logger.info('info');
            logger.debug('debug');
            logger.trace('trace');

            assert.equal(testLogger.messages.fatal.length, 1, 'fatal msg has been logged');
            assert.equal(testLogger.messages.error.length, 1, 'error msg has been logged');
            assert.equal(testLogger.messages.warn.length, 1, 'warn msg has been logged');
            assert.equal(testLogger.messages.info.length, 0, 'no info msg has been logged');
            assert.equal(testLogger.messages.debug.length, 0, 'no debug msg has been logged');
            assert.equal(testLogger.messages.trace.length, 0, 'no trace msg has been logged');
        });
    });

});

describe('Console logger', function() {
    describe('Visual test', function() {
        it('should log in color!', function() {
            const consoleLogger = consoleLoggerFactory();
            consoleLogger.level = 'trace';

            const logger = loggerFactory('testColor', {
                streams: [consoleLogger]
            });
            logger.fatal('fatal');
            logger.error('error');
            logger.warn('warn');
            logger.info('info');
            logger.debug('debug');
            logger.trace('trace');

            assert.isTrue(true, 'consoleLogger display messages in color');
        });
    });
});
