// import * as Configuration from "Configuration/Configuration";
import { ConfigurationInterface } from "Library/Interfaces/Memory/Configuration/ConfigurationInterface";
import { ConfigurationMonitor } from "Library/Monitors/ConfigurationMonitor";
import { ConstructionSitesInterface } from "Library/Interfaces/Memory/ConstructionSites/ConstructionSitesInterface";
import { CreepMonitor } from "Library/Monitors/CreepMonitor";
import { ErrorMapper } from "./Library/Subroutines/Utils/ErrorMapper";
import { GarbageCollector } from "./Library/Subroutines/Utils/GarbageCollector";
import { MonitoringRootMemoryStructure } from "Library/Monitors/MonitoringMonitor";
import { ResourceInterface } from "Library/Interfaces/Memory/Resources/ResourceInterface";
import { RespawnInterface } from "Library/Interfaces/Memory/Respawn/RespawnInterface";
import { RoomMonitor } from "Library/Monitors/RoomMonitor";
import { StructureInterface } from "Library/Interfaces/Memory/Structures/StructureInterface";
// import { Locate } from "Library/Subroutines/Utils/Locate";
// import { Log } from "./Library/Subroutines/Utils/Log";

declare global {
  /*  Memory Interfaces */
  interface Memory {
    Respawn: {
      [key: Uppercase<string>]: RespawnInterface;
    };
    Monitoring: MonitoringRootMemoryStructure;
    Configuration: ConfigurationInterface;
    PathCache: {
      [key: Uppercase<string>]: { [key: string]: any };
    };
    Resources: {
      [key: Uppercase<string>]: ResourceInterface;
    };
    Structures: StructureInterface;
    ConstructionSites: ConstructionSitesInterface;
  }
  interface CreepMemory {
    ClaimMode?: boolean;
    RoomBound: boolean;
    UUID: string;
    Role: Uppercase<string>;
    Resupplying: boolean;
    Room: Uppercase<string>;
    RoleMetadata: { [key: string]: any };
    IDs: {
      [name: string]: Id<any>;
    };
    Tasks: {
      [key: number]: {
        [Task: string]: any;
        Complete: boolean;
      };
    };
    CreepMon: {
      PreviousPosition: {
        X: number;
        Y: number;
        RoomName: Uppercase<string>;
        Time: number;
      };
    };
  }
  // interface FlagMemory {}
  // interface SpawnMemory {}
  // interface RoomMemory {}
  // interface StructureMemory {}
  // interface RespawnInterface {}
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

  /* Load Configuration into Memory */
  new ConfigurationMonitor();

  /* Load RoomMonitors */
  new RoomMonitor("W1N4");
  new RoomMonitor("W2N5");

  /* Load Global CreepMonitor */
  new CreepMonitor();
});
