import {
  appendFileAsync,
  ensureDirectoryAsync,
  fileExistsAsync,
  touchAsync,
} from "@mongez/fs";
import dayjs from "dayjs";
import { EOL } from "os";
import { LogChannel } from "../LogChannel";
import { DebugMode, LogLevel } from "../types";

export type ChunkFileLogConfig = {
  storagePath?: string;
  chunk?: DebugMode;
  dateFormat?: {
    date?: string;
    time?: string;
    month?: string;
  };
};

export class ChunkFileLog extends LogChannel {
  /**
   * {@inheritdoc}
   */
  public name = "chunkFile";

  /**
   * Channel configurations
   */
  protected channelConfigurations: ChunkFileLogConfig = {
    storagePath: process.cwd() + "/storage/logs",
    chunk: "daily",
    dateFormat: {
      date: "DD-MM-YYYY",
      time: "HH:mm:ss",
      month: "MM",
    },
  };

  /**
   * Constructor
   */
  public constructor(configurations?: ChunkFileLogConfig) {
    super();

    if (configurations) {
      this.configurations(configurations);
    }
  }

  /**
   * Set configurations
   */
  public configurations(configurations: ChunkFileLogConfig) {
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

    const fileName = this.getFileName(this.channelConfigurations.chunk!);

    const logsDirectory = this.channelConfigurations.storagePath + "/" + level;

    await ensureDirectoryAsync(logsDirectory);

    const filePath = logsDirectory + "/" + fileName;

    if (!(await fileExistsAsync(filePath))) {
      await touchAsync(filePath);
    }

    const date = dayjs().format(
      `${this.channelConfigurations.dateFormat!.date} ${
        this.channelConfigurations.dateFormat!.time
      }`
    );

    let content = `[${date}] [${module}][${action}]: `;

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

  /**
   * Get file name
   */
  protected getFileName(debugMode: DebugMode) {
    let fileName = "";

    switch (debugMode) {
      case "hourly":
        // file name will be like: 2021-01-01-12-00.log
        fileName = dayjs().format(
          `${this.channelConfigurations.dateFormat!.date}-HH-00.log`
        );
        break;

      case "daily":
        // file name will be like: 2021-01-01.log
        fileName = dayjs().format(
          `${this.channelConfigurations.dateFormat!.date}.log`
        );
        break;

      case "monthly":
        // file name will be like: 2021-01.log
        fileName = dayjs().format(
          `${this.channelConfigurations.dateFormat!.month}.log`
        );
        break;

      case "yearly":
        // file name will be like: 2021.log
        fileName = dayjs().format("YYYY.log");
        break;
    }

    return fileName;
  }
}
