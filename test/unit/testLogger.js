const { Writable } = require('stream');

function levelCodeToString(code) {
    switch (code) {
        case 60: return 'fatal';
        case 50: return 'error';
        case 40: return 'warn';
        case 30: return 'info';
        case 20: return 'debug';
        case 10: return 'trace';
    }
}

function testLoggerFactory() {
    const messages = {
        fatal: [],
        error: [],
        warn: [],
        info: [],
        debug: [],
        trace: []
    };

    const stream = new Writable({
        write(chunk, encoding, done) {
            const logEntry = JSON.parse(chunk.toString());
            const level = levelCodeToString(logEntry.level);
            messages[level].push(logEntry.msg);
            done();
        }
    });

    return {
        stream,
        messages
    };
}

module.exports = testLoggerFactory;