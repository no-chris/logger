const { Writable } = require('stream');

/*
Black            \e[0;30m
Blue             \e[0;34m
Green            \e[0;32m
Cyan             \e[0;36m
Red              \e[0;31m
Purple           \e[0;35m
Brown            \e[0;33m
Gray             \e[0;37m
Dark Gray        \e[1;30m
Light Blue       \e[1;34m
Light Green      \e[1;32m
Light Cyan       \e[1;36m
Light Red        \e[1;31m
Light Purple     \e[1;35m
Yellow           \e[1;33m
White            \e[1;37m
 */

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
        write(chunk, encoding, done) {
            const logEntry = JSON.parse(chunk.toString());
            const level = levelCodeToString(logEntry.level);
            const fullMsg = level.toUpperCase() + ': ' + logEntry.msg;

            /* eslint-disable no-console */
            console.log(levelColors[level] + '%s' + allColors.Reset, fullMsg);
            /* eslint-enable no-console */

            done();
        }
    });

    return {
        stream
    };
}

module.exports = consoleLoggerFactory;