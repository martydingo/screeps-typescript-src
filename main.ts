import { ErrorMapper } from "./utils/ErrorMapper";
import { GarbageCollector } from "./utils/GarbageCollector";
import { Logger } from "./utils/Logger";
import { UUID } from "./utils/UUID";

enum SeverityLevel {
  Emergency = "Emergency",
  Alert = "Alert",
  Critical = "Critical",
  Error = "Error",
  Warning = "Warning",
  Notice = "Notice",
  Informational = "Informational",
  Debug = "Debug"
}

declare global {
  interface CreepMemory {}
  interface FlagMemory {}
  interface SpawnMemory {}
  interface RoomMemory {}
}
// Syntax for adding properties to `global` (ex "global.log")
// eslint-disable-next-line @typescript-eslint/no-namespace
//   namespace NodeJS {
//     interface Global {
//       Log: any;
//     }
//   }

export const loop = ErrorMapper.wrapLoop(() => {
  /* Garbage Collection Routine */
  void GarbageCollector.Run();
  new Logger();
  Logger.log(SeverityLevel.Debug, UUID.generateUUID("dev"));
});
