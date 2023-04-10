# Mongez Logger

A powerful yet simple logger for Node.js

## Features

- Fully async and non-blocking which doesn't affect the performance of your application.
- Easy to use and configure.
- Has multiple channels to log the messages to.
- You can add your own custom channels for logging.

## Installation

`yarn add @mongez/logger`

Or

`npm i @mongez/logger`

## Usage

At an early point of the application, you need to initialize the logger:

```ts
import logger, { FileLog,  } from '@mongez/logger';

logger.configure({
    channels: [
        new FileLog(),
        new ConsoleLog()
    ]
});
```

Here we declared our logger configurations to use the `FileLog` and `ConsoleLog` channels, the file log channel will log all the logs to a file, and the console log channel will log all the logs to the console.

## Logging Strategy

To go any value simple use `log` function, it mainly receives 4 parameters:

- `module`: the module name, it's used to group the logs, for example, if you have a module called `request`, all the logs related to the request module will be grouped under the `request` module.
- `action`: the action name, it's used to group the logs, for example, if you have an action called `create`, all the logs related to the `create` action will be grouped under the `create` action.
- `message`: the message to log.
- `level`: there are 4 types of logging `warn`, `info`, `error`, `debug`, the default is `info`.

## Examples

```ts
import { log } from '@mongez/logger';

log('request', 'create', 'user created successfully', 'info');
```

You can also use `log.info` `log.warn` `log.error` `log.debug` functions to log the message.

```ts
import { log } from '@mongez/logger';

log.info('request', 'create', 'user created successfully');

if (somethingWentWrong) {
    log.error('request', 'create', 'something went wrong');
}

database.on('connection', () => {
    log.success('database', 'connection', 'database connected successfully');
})
```

## Console Log Channel

The console log channel will log all the logs to the console, the message appears in the console will be colored based on the log level using [chalk](https://www.npmjs.com/package/chalk).

```ts
import logger, { ConsoleLog } from '@mongez/logger';

logger.configure({
    channels: [
        new ConsoleLog()
    ]
});
```

## File Log Channel

The file log channel will log all the logs to a **single file**, the file will be created in the `logs` directory in `/storage` directory with name `app.log` by default, however, you can change the file name and the directory path.

```ts
import logger, { FileLog } from '@mongez/logger';

logger.configure({
    channels: [
        new FileLog({
            storageDirectory: process.cwd() + '/logs',
            fileName: 'app.log'
        })
    ]
});
```

The message time is stored by default prefixed with current date/time in this format `YYYY-MM-DD HH:mm:ss`, however, you can change the format by passing the `dateFormat` option.

```ts
import logger, { FileLog } from '@mongez/logger';

logger.configure({
    channels: [
        new FileLog({
            dateFormat: {
                date: 'DD-MM-YYYY',
                time: 'HH:mm:ss'
            }
        })
    ]
});
```

> You can see the available date/time formats in [dayjs](https://day.js.org/docs/en/display/format) documentation.

This could be useful with small projects, but it's not recommended to use it if the application is large, because the file will be very large and it will affect the performance of the application, you can use the following channels to solve this problem.

## Chunk File Log Channel

This channel will log all the logs to multiple files, it could be based on `daily` basis, `monthly` basis, `yearly` basis or even`hourly` basis.

```ts
import logger, { ChunkFileLog } from '@mongez/logger';

logger.configure({
    channels: [
        new ChunkFileLog({
            storageDirectory: process.cwd() + '/logs',
            chunk: 'daily', // default is daily
            dateFormat: {
                date: 'DD-MM-YYYY',
                time: 'HH:mm:ss'
                month: 'YYYY MM',
            },
        })
    ]
});
```

For better performance, the file will be created in the `logs` directory in `/storage`, each file will be named based on the date, for example, if the date is `2021-01-01`, the file name will be `2021-01-01.log`, and the message time is stored by default prefixed with current date/time in this format `YYYY-MM-DD HH:mm:ss`, however, you can change the format by passing the `dateFormat` option.

## JSON File Log Channel

Works exactly in the same sense of [Chunk File Log Channel](#chunk-file-log-channel), but the difference is that the logs will be stored in JSON format.

```ts
import logger, { JSONFileLog } from '@mongez/logger';

logger.configure({
    channels: [
        new JSONFileLog({
            storageDirectory: process.cwd() + '/logs',
            chunk: 'daily', // default is daily
            dateFormat: {
                date: 'DD-MM-YYYY',
                time: 'HH:mm:ss'
                month: 'YYYY MM',
            },
        })
    ]
});
```

Example of output log file

`/storage/logs/01-04-2023.json`

```json
{
    "date": "01-04-2023",
    "logs": [
        {
            "module": "request",
            "action": "create",
            "message": "user created successfully",
            "level": "info",
            "date": "01-04-2023",
            "time": "12:00:00"            
        }
    ]
}
```

If the log is an `error` log, the trace will also be included:

`/storage/logs/01-04-2023.json`

```json
{
    "date": "01-04-2023",
    "logs": [
        {
            "module": "request",
            "action": "create",
            "message": "user created successfully",
            "level": "error",
            "date": "01-04-2023",
            "time": "12:00:00",
            "trace": "Error: something went wrong...."
        }
    ]
}
```

## JSON File Typed Log Channel

This channel pretty much the same as `JSON File Log Channel`, but the difference is that the file path is structured as follows:

`/$storagePath/json/$level/$module/$action/$date.json`

Where `$level` is the log level, `$module` is the module name, `$action` is the action name, and `$date` is the date format.

This will make files more organized and easier to trace.

```ts
import logger, { JSONFileTypedLog } from '@mongez/logger';

logger.configure({
    channels: [
        new JSONFileTypedLog({
            storageDirectory: process.cwd() + '/logs',
            dateFormat: {
                date: 'DD-MM-YYYY',
                time: 'HH:mm:ss'
                month: 'YYYY MM',
            },
        })
    ]
});
```

## Create Custom Log Channel

You can create your own log channel by extending the `LogChannel` class

```ts
import { LogChannel, LogLevel } from '@mongez/logger';

export default class CustomLogChannel extends LogChannel {
    /**
     * Log the message
     * 
     * @param module 
     * @param action 
     * @param message 
     * @param level 
     */
    public async log(module: string, action: string, message: string, level: LogLevel) {
        // log the message
    }
}
```

If the log channel will output something in the terminal, mark the `terminal` property as `true`.

```ts
import { LogChannel, LogLevel } from '@mongez/logger';

export default class CustomLogChannel extends LogChannel {
    /**
     * Whether the log channel will output something in the terminal
     */
    public terminal = true;

    /**
     * Log the message
     * 
     * @param module 
     * @param action 
     * @param message 
     * @param level 
     */
    public async log(module: string, action: string, message: string, level: LogLevel) {
        // log the message
    }
}
```

This will automatically parse and remove the ANSI color codes from the message.

Now you can use the custom log channel in your application.

```ts
import logger, { CustomLogChannel } from '@mongez/logger';

logger.configure({
    channels: [
        new CustomLogChannel()
    ]
});
```

## Capture Uncaught Errors

If you want automatically capture any unhandled errors, you can import `captureAnyUnhandledRejection` function and call it in your application entry point.

```ts
import { captureAnyUnhandledRejection } from '@mongez/logger';

captureAnyUnhandledRejection();
```
