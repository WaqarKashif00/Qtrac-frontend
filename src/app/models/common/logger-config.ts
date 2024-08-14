import { LogLevel } from '../enums/log-level.enum';

export class LoggerConfig {
  LogLevel ?= LogLevel.Debug;
  EnableServerErrorLogs ?= true;
  EnableServerLogs ?= true;
}
