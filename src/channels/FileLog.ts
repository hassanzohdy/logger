import {
  appendFileAsync,
  ensureDirectoryAsync,
  fileExistsAsync,
  touchAsync,
} from "@mongez/fs";
import dayjs from "dayjs";
import { EOL } from "os";
import { LogChannel } from "../LogChannel";
import { LogLevel } from "../types";

export type FileLogConfig = {
  storagePath?: string;
  name?: string;
  dateFormat?: {
    date?: string;
    time?: string;
  };
};

export class FileLog extends LogChannel {
  /**
   * {@inheritdoc}
   */
  public name = "file";

  /**
   * Channel configurations
   */
  protected channelConfigurations: FileLogConfig = {
    storagePath: process.cwd() + "/storage/logs",
    name: "app.log",
    dateFormat: {
      date: "DD-MM-YYYY",
      time: "HH:mm:ss",
    },
  };

  /**
   * Constructor
   */
  public constructor(configurations?: FileLogConfig) {
    super();

    if (configurations) {
      this.configurations(configurations);
    }
  }

  /**
   * Set configurations
   */
  public configurations(configurations: FileLogConfig) {
    this.channelConfigurations = {
      ...this.channelConfigurations,
      ...configurations,
      dateFormat: {
        ...this.channelConfigurations.dateFormat,
        ...configurations.dateFormat,
      },
    };

    return this;
  }

  /**
   * {@inheritdoc}
   */
  public async log(
    module: string,
    action: string,
    message: any,
    level: LogLevel
  ) {
    // check for debug mode

    const fileName = this.channelConfigurations.name;

    const logsDirectory = this.channelConfigurations.storagePath as string;

    await ensureDirectoryAsync(logsDirectory);

    const filePath = logsDirectory + "/" + fileName;

    if (!(await fileExistsAsync(filePath))) {
      await touchAsync(filePath);
    }

    const date = dayjs().format(
      this.channelConfigurations.dateFormat!.date +
        " " +
        this.channelConfigurations.dateFormat!.time
    );

    let content = `[${date}] [${level}] [${module}][${action}]: `;

    // check if message is an instance of Error
    if (message instanceof Error) {
      // in that case we need to store the error message and stack trace
      content += message.message + EOL;
      content += `[trace]` + EOL;
      content += message.stack;
    } else {
      content += message;
    }

    await appendFileAsync(filePath, content + EOL);
  }
}
