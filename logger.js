const { createLogger, format, transports } = require("winston");
const chalk = require("chalk");
const { combine, timestamp, printf, splat } = format;
const consoleFormat = printf(({ level, message, label, timestamp }) => {
    var levelUpper = level.toUpperCase();
    switch (levelUpper) {
        case "INFO":
            message = chalk.green(message);
            level = chalk.black.bgGreenBright.bold(level);
            break;

        case "WARN":
            message = chalk.yellow(message);
            level = chalk.black.bgYellowBright.bold(level);
            break;

        case "ERROR":
            message = chalk.red(message);
            level = chalk.black.bgRedBright.bold(level);
            break;

        default:
            break;
    }
    return `[${timestamp}] [${level}]: ${message}`;
});
const fileFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] [${level}]: ${message}`;
});
const logger = createLogger({
    level: "info",
    format: combine(timestamp(), splat(), consoleFormat),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: "logs/main.log",
            format: combine(timestamp(), splat(), fileFormat),
        }),
    ],
});

module.exports = logger;
