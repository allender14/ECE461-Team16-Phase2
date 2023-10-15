"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugLogger = exports.infoLogger = void 0;
var winston_1 = require("winston");
var combine = winston_1.format.combine, label = winston_1.format.label, timestamp = winston_1.format.timestamp, printf = winston_1.format.printf;
var customFormat = printf(function (_a) {
    var level = _a.level, message = _a.message, label = _a.label, timestamp = _a.timestamp;
    return "".concat(timestamp, " [").concat(label, "] ").concat(level, ": ").concat(message);
});
var createCustomLogger = function (labelStr, level) {
    return (0, winston_1.createLogger)({
        level: level || 'info',
        format: combine(label({ label: labelStr }), timestamp(), customFormat),
        transports: [
            new winston_1.transports.Console(),
            new winston_1.transports.File({
                filename: process.env.LOG_FILE,
            }),
        ],
    });
};
var infoLogger = createCustomLogger('INFO', 'info');
exports.infoLogger = infoLogger;
var debugLogger = createCustomLogger('DEBUG', 'debug');
exports.debugLogger = debugLogger;
