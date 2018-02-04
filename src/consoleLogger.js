/**
 * A colored-console logger
 */
const { Writable } = require('stream');
const _ = require('lodash');

// taken from https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
const allColors = {
    Reset: '\x1b[0m',
    Bright: '\x1b[1m',
    Dim: '\x1b[2m',
    Underscore: '\x1b[4m',
    Blink: '\x1b[5m',
    Reverse: '\x1b[7m',
    Hidden: '\x1b[8m',

    FgDarkGray: '\x1b[30m',
    FgRed: '\x1b[31m',
    FgGreen: '\x1b[32m',
    FgYellow: '\x1b[33m',
    FgBlue: '\x1b[34m',
    FgMagenta: '\x1b[35m',
    FgCyan: '\x1b[36m',
    FgWhite: '\x1b[37m',

    BgBlack: '\x1b[40m',
    BgRed: '\x1b[41m',
    BgGreen: '\x1b[42m',
    BgYellow: '\x1b[43m',
    BgBlue: '\x1b[44m',
    BgMagenta: '\x1b[45m',
    BgCyan: '\x1b[46m',
    BgWhite: '\x1b[47m'
};

const levelColors = {
    fatal: allColors.FgRed + allColors.Underscore,
    error: allColors.FgRed,
    warn: allColors.FgYellow,
    info: allColors.FgGreen,
    debug: allColors.FgCyan,
    trace: allColors.FgCyan
};

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


function consoleLoggerFactory() {
    const stream = new Writable({
        objectMode: true,
        write(data, encoding, done) {
            const module = data.module;
            const level = levelCodeToString(data.level);
            const msg = (data.msg)
                ? data.msg
                // clean bunyan default fields
                : JSON.stringify(_.omit(data, ['module', 'hostname', 'pid', 'name', 'level', 'time', 'v', 'msg']));

            const fullMsg = level.toUpperCase() + '|' + module + ': ' + msg;

            /* eslint-disable no-console */
            console.log(levelColors[level] + '%s' + allColors.Reset, fullMsg);
            if (data.err) {
                console.log(levelColors[level] + data.err.stack + allColors.Reset);
            }
            /* eslint-enable no-console */

            done();
        }
    });

    return {
        name: 'console',
        type: 'raw',
        stream: stream
    };
}

module.exports = consoleLoggerFactory;