import {
  ensureDirectoryAsync,
  fileExistsAsync,
  getJsonFileAsync,
  putJsonFileAsync,
} from "@mongez/fs";
import dayjs from "dayjs";
import { LogLevel } from "../types";
import { ChunkFileLog, ChunkFileLogConfig } from "./ChunkFileLog";

export class JSONFileLog extends ChunkFileLog {
  /**
   * {@inheritdoc}
   */
  public name = "jsonFile";

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

    const logsDirectory = this.channelConfigurations.storagePath + "/json";

    await ensureDirectoryAsync(logsDirectory);

    const filePath = logsDirectory + "/" + fileName;

    if (!(await fileExistsAsync(filePath))) {
      await putJsonFileAsync(
        filePath,
        {
          date: dayjs().format(this.channelConfigurations.dateFormat!.date),
          logs: [],
        },
        {
          spaces: 2,
        }
      );
    }

    const data = {
      level,
      module,
      action,
      message,
      date: dayjs().format(this.channelConfigurations.dateFormat!.date),
      time: dayjs().format(this.channelConfigurations.dateFormat!.time),
      trace: undefined as undefined | string,
    };

    // check if message is an instance of Error
    if (message instanceof Error) {
      data.trace = message.stack;
    } else {
      delete data.trace;
    }

    const jsonContent: any = await getJsonFileAsync(filePath);

    jsonContent.logs.push(data);

    await putJsonFileAsync(filePath, jsonContent, {
      spaces: 2,
    });
  }
}
