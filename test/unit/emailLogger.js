const loggerFactory = require('../../src/factory');
const emailLoggerFactory = require('../../src/emailLogger');

describe('Email Logger', function() {
    describe('emailLoggerFactory', function() {
        it.skip('should send an email', function() {
            const emailStream = emailLoggerFactory({
                from: 'logs@christophenoel.fr',
                to: 'touffi51@gmail.com',
            }, {
                host: 'mail.gandi.net',
                port: 25, // 25, 465 (with SSL) or 587 (with STARTTLS)
                secure: false,
                auth: {
                    type: 'login',
                    user: 'xxxx',
                    pass: 'xxxx'
                }
            });
            loggerFactory.registerStream(emailStream);

            const logger = loggerFactory('mailLogger');
            logger.error('This is a f* error');

            emailStream.stream.end();
        });
    });
});
