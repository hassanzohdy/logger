import { getFile, removeDirectory } from "@mongez/fs";
import dayjs from "dayjs";
import logger, { FileLog, log } from "../src";

describe("@mongez/logger/file-log", () => {
  beforeAll(() => {
    logger.setChannels([
      new FileLog({
        storagePath: process.cwd() + "/storage/file-logs",
        dateFormat: {
          date: "DD-MM-YYYY",
        },
      }),
    ]);
  });

  afterAll(() => {
    logger.setChannels([]);

    removeDirectory(process.cwd() + "/storage");
  });

  it("should log to file", async () => {
    await log("app", "boot", "booting app", "warn");

    const logFilePath =
      process.cwd() +
      "/storage/file-logs/" +
      dayjs().format("DD-MM-YYYY") +
      ".log";

    const fileContent = getFile(logFilePath);

    expect(fileContent).toContain(`[warn] [app][boot]: booting app`);
  });
});
