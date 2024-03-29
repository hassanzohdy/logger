import chalk from "chalk";
import { LogChannel } from "../LogChannel";
import { LogLevel } from "../types";

export class ConsoleLog extends LogChannel {
  /**
   * {@inheritdoc}
   */
  public name = "console";

  /**
   * Determine if channel is logging in terminal
   */
  public terminal = true;

  /**
   * {@inheritdoc}
   */
  public log(module: string, action: string, message: any, level: LogLevel) {
    // display date and time with milliseconds
    const date = new Date().toISOString(); // i.e 2021-01-01T00:00:00.000Z
    switch (level) {
      case "debug":
        // add a debug icon
        console.log(
          chalk.magentaBright("⚙"),
          chalk.yellow(`(${date})`),
          chalk.cyan(`[${module}]`),
          chalk.magenta(`[${action}]`),
          chalk.magentaBright(message)
        );
        break;
      case "info":
        // add an info icon
        console.log(
          chalk.blueBright("ℹ"),
          chalk.yellow(`(${date})`),
          chalk.cyan(`[${module}]`),
          chalk.magenta(`[${action}]`),
          chalk.blueBright(message)
        );
        break;
      case "warn":
        // add a warning icon
        console.log(
          chalk.yellow("⚠"),
          chalk.green(`(${date})`),
          chalk.cyan(`[${module}]`),
          chalk.magenta(`[${action}]`),
          chalk.yellowBright(message)
        );
        break;
      case "error":
        // add an error icon
        console.log(
          chalk.red("✗"),
          chalk.yellow(`(${date})`),
          chalk.cyan(`[${module}]`),
          chalk.magenta(`[${action}]`),
          chalk.redBright(message)
        );
        break;

      case "success":
        // add a success icon
        console.log(
          chalk.green("✓"),
          chalk.yellow(`(${date})`),
          chalk.cyan(`[${module}]`),
          chalk.magenta(`[${action}]`),
          chalk.greenBright(message)
        );
        break;

      default:
        console.log(
          "[log]",
          chalk.yellow(`(${date})`),
          chalk.cyan(`[${module}]`),
          chalk.magenta(`[${action}]`),
          message
        );
    }

    if (typeof message === "object") {
      console.log(message);
    }
  }
}
