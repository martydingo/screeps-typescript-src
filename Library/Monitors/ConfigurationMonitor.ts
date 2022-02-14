/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { RoomCreepConfiguration } from "Configuration/Room/Creep";

export class ConfigurationMonitor {
  public constructor() {
    ConfigurationMonitor.__InitMemArr__();
  }

  private static __InitMemArr__(): void {
    if (!Memory.Configuration) {
      Memory.Configuration = {};
    }

    for (const RoomName in RoomCreepConfiguration) {
      if (RoomName !== "Global") {
        if (!Memory.Configuration[RoomName]) {
          Memory.Configuration[RoomName] = {
            Creeps: RoomCreepConfiguration.Global.Creeps
          };
          Memory.Configuration[RoomName].Creeps = RoomCreepConfiguration[RoomName].Creeps;
          this.__InitCreepConfigMemArr__(RoomName);
        }
      }
    }

    // for (const RoomName in Game.rooms) {
    //   if (!Memory.Configuration[RoomName]) {
    //     Memory.Configuration[RoomName] = {
    //       Creeps: RoomCreepConfiguration.Global.Creeps
    //     };
    //   }

    //   /* Creep Configuration Initialization */
    //   if (RoomCreepConfiguration[RoomName]) {
    //     Memory.Configuration[RoomName].Creeps = RoomCreepConfiguration[RoomName].Creeps;
    //   }
    // }
  }
  private static __InitCreepConfigMemArr__(RoomName: Uppercase<string>): void {
    const CreepConfiuration: any = RoomCreepConfiguration[RoomName].Creeps;
    if (CreepConfiuration) {
      for (const Role in CreepConfiuration) {
        if (!Memory.Configuration[RoomName].Creeps[Role]) {
          Memory.Configuration[RoomName].Creeps[Role] = {};
        }
        for (const Property in CreepConfiuration[Role]) {
          const Value = CreepConfiuration[Role][Property];
          Memory.Configuration[RoomName].Creeps[Role][Property] = Value;
        }
      }
    }
  }
}
