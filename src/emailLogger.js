/**
 * This is a fork of https://www.npmjs.com/package/cubes-bunyan-emailstream
 */
const util = require('util');
const extend = util._extend;
const stream = require('stream');
const nodemailer = require('nodemailer');

const Stream = stream.Writable || stream.Stream;

/**
 * Convert level integer to level name string
 */
const LEVELS = {
    10: 'TRACE',
    20: 'DEBUG',
    30: 'INFO',
    40: 'WARN',
    50: 'ERROR',
    60: 'FATAL',
};

function levelName(level) {
    return LEVELS[level] || 'LVL' + level;
}

function EmailStream(mailOptions, transportOptions) {
    Stream.call(this);
    this.writable = true;

    this._mailOptions = extend({}, mailOptions);
    this._transportOptions = extend({}, transportOptions);

    this._transport = nodemailer.createTransport(this._transportOptions);
}

util.inherits(EmailStream, Stream);

EmailStream.prototype.write = function (log) {
    const self = this;
    const message = extend({}, this._mailOptions);

    if (! message.subject) {
        message.subject = formatSubject(log);
    }
    message.text = formatBody(log);

    this._transport.sendMail(message, function (err, response) {
        if (err) {
            self.emit('error', err);
        } else {
            self.emit('mailSent', response);
        }
    });
};

EmailStream.prototype.end = function () {
    if (this._transport) {
        this._transport.close();
    }
};

function formatSubject(log) {
    return util.format(
        '[%s] %s/%s on %s',
        levelName(log.level),
        log.name,
        log.pid,
        log.hostname
    );
}

function formatBody(log) {
    const rows = [];
    rows.push('* name: ' + log.name);
    rows.push('* hostname: ' + log.hostname);
    rows.push('* pid: ' + log.pid);
    rows.push('* time: ' + log.time);

    if (log.msg) {
        rows.push('* msg: ' + log.msg);
    }

    if (log.err) {
        rows.push('* err.stack: ' + log.err.stack);
    }

    return rows.join('\n');
}


module.exports = function emailLoggerFactory(mailOptions, transportOptions) {
    return {
        name: 'console',
        type: 'raw',
        stream: new EmailStream(mailOptions, transportOptions)
    };
};