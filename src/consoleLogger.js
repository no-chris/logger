/**
 * A colored-console logger
 */
const { Writable } = require('stream');
const _ = require('lodash');
const chalk = require('chalk');

function getColoredMsg(level, msg) {
    const sep = chalk.grey(' | ');

    switch(level) {
        case 60: return chalk.bold.underline.red('FATAL') + sep + chalk.underline.red(msg);
        case 50: return chalk.bold.red('ERROR') + sep + chalk.red(msg);
        case 40: return chalk.bold.yellow(' WARN') + sep + chalk.yellow(msg);
        case 30: return chalk.bold.green(' INFO') + sep + chalk.green(msg);
        case 20: return chalk.bold.cyan('DEBUG') + sep + chalk.cyan(msg);
        case 10: return chalk.bold.grey('TRACE') + sep + chalk.gray(msg);
    }
}

function consoleLoggerFactory() {
    const stream = new Writable({
        objectMode: true,
        write(data, encoding, done) {
            const module = data.module;
            const msg = (data.msg)
                ? data.msg
                // clean bunyan default fields
                : JSON.stringify(_.omit(data, ['module', 'hostname', 'pid', 'name', 'level', 'time', 'v', 'msg']));

            const fullMsg = module + ': ' + msg;

            /* eslint-disable no-console */
            console.log(getColoredMsg(data.level, fullMsg));
            if (data.err) {
                console.log(getColoredMsg(data.level, data.err.stack));
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