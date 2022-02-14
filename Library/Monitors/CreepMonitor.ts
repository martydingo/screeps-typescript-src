/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { CreepUtils } from "Library/Subroutines/Utils/CreepUtils";
import { GlobalConstants } from "Configuration/Global/Constants";
import { RoomUtil } from "Library/Subroutines/Utils/RoomUtils";
import { SourceMinder } from "Library/Creeps/Minders/SourceMinder";
import { SpawnMinder } from "Library/Creeps/Minders/SpawnMinder";
import { RoomControllerMinder } from "Library/Creeps/Minders/RoomControllerMinder";
import { ConstructionSiteMinder } from "Library/Creeps/Minders/ConstructionSiteMinder";
import { Scout } from "Library/Creeps/WideArea/Scout";

export class CreepMonitor {
  private ConfiguredRoles: string[];
  public constructor() {
    this.ConfiguredRoles = [];
    for (const Role in Memory.Configuration.Creeps) {
      this.ConfiguredRoles.push(Role);
    }
    this.__RunCreeps__();
  }

  private __FetchSourceMinders__(): Id<Creep>[] {
    const SourceMinderArray: Id<Creep>[] = [];
    for (const RoomName in Game.rooms) {
      const SOMRespawnRoleArray = Memory.Respawn[RoomName].Roles.SOM;
      for (const SourceIDString in SOMRespawnRoleArray) {
        const SourceID = SourceIDString as Id<Source>;
        const SourceMinderID: Id<Creep> | null = SOMRespawnRoleArray[SourceID].AssignedCreep;
        if (SourceMinderID) {
          SourceMinderArray.push(SourceMinderID);
        }
      }
    }
    return SourceMinderArray;
  }

  private __FetchScouts__(): Id<Creep>[] {
    const ScoutArray: Id<Creep>[] = [];
    for (const CreepName in Game.creeps) {
      const Creep: Creep = Game.creeps[CreepName];
      if (Creep.memory.Role === "SCO") {
        ScoutArray.push(Creep.id);
      }
    }

    return ScoutArray;
  }

  private __FetchSpawnMinders__(): Id<Creep>[] {
    const SpawnMinderArray: Id<Creep>[] = [];
    for (const CreepName in Game.creeps) {
      const Creep: Creep = Game.creeps[CreepName];
      if (Creep.memory.Role === "SPM") {
        SpawnMinderArray.push(Creep.id);
      }
    }

    return SpawnMinderArray;
  }

  private __FetchRoomControllerMinders__(): Id<Creep>[] {
    const RoomControllerMinderArray: Id<Creep>[] = [];
    for (const CreepName in Game.creeps) {
      const Creep: Creep = Game.creeps[CreepName];
      if (Creep.memory.Role === "RCM") {
        RoomControllerMinderArray.push(Creep.id);
      }
    }

    return RoomControllerMinderArray;
  }

  private __FetchConstructionSiteMinders__(): Id<Creep>[] {
    const ConstructionSiteMinderArray: Id<Creep>[] = [];
    for (const CreepName in Game.creeps) {
      const Creep: Creep = Game.creeps[CreepName];
      if (Creep.memory.Role === "CSM") {
        ConstructionSiteMinderArray.push(Creep.id);
      }
    }

    return ConstructionSiteMinderArray;
  }

  private __RunSpawnMinders__() {
    const SpawnMinderArray: Id<Creep>[] = this.__FetchSpawnMinders__();
    SpawnMinderArray.forEach(CreepIDString => {
      const CreepID = CreepIDString;
      const Creep: Creep | null = Game.getObjectById(CreepID);
      if (Creep) {
        new SpawnMinder(Creep.memory.Room);
        SpawnMinder.Run(Creep.id);
      }
    });
  }

  private __RunScouts__() {
    const ScoutArray: Id<Creep>[] = this.__FetchScouts__();
    ScoutArray.forEach(CreepIDString => {
      const CreepID = CreepIDString;
      const Creep: Creep | null = Game.getObjectById(CreepID);
      if (Creep) {
        new Scout(Creep.memory.Room);
        Scout.Run(Creep.id);
      }
    });
  }

  private __RunConstructionSiteMinders__() {
    const RoomControllerMinderArray: Id<Creep>[] = this.__FetchConstructionSiteMinders__();
    RoomControllerMinderArray.forEach(CreepIDString => {
      const CreepID = CreepIDString;
      const Creep: Creep | null = Game.getObjectById(CreepID);
      if (Creep) {
        new ConstructionSiteMinder(Creep.memory.Room);
        ConstructionSiteMinder.Run(Creep.id);
      }
    });
  }

  private __RunRoomControllerMinders__() {
    const RoomControllerMinderArray: Id<Creep>[] = this.__FetchRoomControllerMinders__();
    RoomControllerMinderArray.forEach(CreepIDString => {
      const CreepID = CreepIDString;
      const Creep: Creep | null = Game.getObjectById(CreepID);
      if (Creep) {
        new RoomControllerMinder(Creep.memory.Room);
        RoomControllerMinder.Run(Creep.id);
      }
    });
  }

  private __RunSourceMinders__() {
    const SourceMinderArray: Id<Creep>[] = this.__FetchSourceMinders__();
    SourceMinderArray.forEach(CreepIDString => {
      const CreepID = CreepIDString;
      const Creep: Creep | null = Game.getObjectById(CreepID);
      if (Creep) {
        new SourceMinder(Creep.memory.Room, Creep.memory.IDs.AssignedSource);
        SourceMinder.Run(CreepID);
      }
    });
  }

  private __RunCreeps__(): void {
    for (const CreepName in Game.creeps) {
      const Creep: Creep = Game.creeps[CreepName];
      const CreepMovingHome: boolean = this.__MoveCreepHome__(Creep);
      if (CreepMovingHome === true) {
        // Run Monitor Code
        return;
      }
    }
    this.__RunSourceMinders__();
    this.__RunSpawnMinders__();
    this.__RunRoomControllerMinders__();
    this.__RunConstructionSiteMinders__();
  }
  private __MoveCreepHome__(Creep: Creep) {
    if (Creep.memory.RoomBound) {
      if (Creep.memory.Room !== Creep.pos.roomName) {
        const EmptyHomeRoomPosition: RoomPosition = RoomUtil.GetWalkablePos(Creep.memory.Room);
        Creep.moveTo(EmptyHomeRoomPosition);
        return true;
      }
      return false;
    }
    return false;
  }

  //
}
