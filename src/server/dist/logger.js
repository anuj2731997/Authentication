"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, printf, colorize } = winston_1.format;
// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});
const logger = (0, winston_1.createLogger)({
    level: 'debug', // log levels: error < warn < info < http < verbose < debug < silly
    format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    transports: [
        new winston_1.transports.Console(), // print to console
        new winston_1.transports.File({ filename: 'logs/error.log', level: 'error' }), // errors only
        new winston_1.transports.File({ filename: 'logs/combined.log' }) // all logs
    ],
    exitOnError: false
});
exports.default = logger;
