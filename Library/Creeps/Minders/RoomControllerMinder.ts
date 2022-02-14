import { Log } from "Library/Subroutines/Utils/Log";
import { TemplateCreep } from "../../Templates/TemplateCreep";
import { UUID } from "../../Subroutines/Utils/UUID";

export class RoomControllerMinder extends TemplateCreep {
  public CreepBodyPartArray: BodyPartConstant[];
  public constructor(Room: Uppercase<string>, SpawnerID?: Id<StructureSpawn>) {
    super();
    this.CreepMemoryArray.UUID = UUID.generateUUID("RCM");
    this.CreepMemoryArray.Room = Room;
    this.CreepMemoryArray.Role = "RCM";
    this.CreepMemoryArray.ClaimMode = Memory.Configuration[Room].Creeps.RCM.ClaimMode;

    if (Memory.Configuration[Room].Creeps.RCM.ClaimMode === false) {
      this.CreepBodyPartArray = Memory.Configuration[Room].Creeps.RCM.BodyParts;
    } else {
      this.CreepBodyPartArray = [CLAIM, CARRY, WORK, MOVE];
    }

    if (SpawnerID) {
      RoomControllerMinder.Spawn(SpawnerID, this.CreepBodyPartArray, this.CreepMemoryArray);
    }
  }
  public static Run(CreepID: Id<Creep>): void {
    const Creep: Creep | null = Game.getObjectById(CreepID);
    if (Creep) {
      if (Creep.memory.ClaimMode === false) {
        const RoomController: StructureController | undefined = Game.rooms[Creep.memory.Room].controller;
        if (RoomController) {
          if (!RoomController.my) {
            this.ReserveController(Creep.id);
          } else {
            this.CheckResupplyRequired(Creep.id);
            if (Creep.memory.Resupplying === false) {
              this.UpgradeRoomController(Creep.id);
            } else {
              this.PickupDroppedEnergy(Creep.id);
            }
          }
        }
      } else {
        RoomControllerMinder.ClaimController(Creep.id);
      }
    }
  }

  public static ClaimController(CreepID: Id<Creep>): void {
    const Creep: Creep | null = Game.getObjectById(CreepID);
    if (Creep) {
      const RoomController: StructureController | undefined = Creep.room.controller;
      if (RoomController) {
        const ClaimResult: CreepActionReturnCode | -8 | -15 = Creep.claimController(RoomController);
        if (ClaimResult === ERR_NOT_IN_RANGE) {
          Creep.moveTo(RoomController);
        }
      }
    }
  }

  public static ReserveController(CreepID: Id<Creep>): void {
    const Creep: Creep | null = Game.getObjectById(CreepID);
    if (Creep) {
      const RoomController: StructureController | undefined = Creep.room.controller;
      if (RoomController) {
        const ReserveResult: CreepActionReturnCode | -8 | -15 = Creep.reserveController(RoomController);
        if (ReserveResult === ERR_NOT_IN_RANGE) {
          Creep.moveTo(RoomController);
        }
      }
    }
  }

  public static UpgradeRoomController(CreepID: Id<Creep>): void {
    const Creep: Creep | null = Game.getObjectById(CreepID);
    if (Creep) {
      const RoomController: StructureController | undefined = Game.rooms[Creep.memory.Room].controller;
      if (RoomController) {
        const UpgradeResult: CreepActionReturnCode | -2 | -3 | -5 | -6 | -8 | -10 | -14 | -15 =
          Creep.upgradeController(RoomController);
        if (UpgradeResult === ERR_NOT_IN_RANGE) {
          Creep.moveTo(RoomController.pos);
        }
      }
    }
  }

  public static ClaimRoomController(CreepID: Id<Creep>): void {
    const Creep: Creep | null = Game.getObjectById(CreepID);
    if (Creep) {
      const RoomController: StructureController | undefined = Game.rooms[Creep.memory.Room].controller;
      if (RoomController) {
        const ClaimResult: CreepActionReturnCode | -2 | -3 | -5 | -6 | -8 | -10 | -14 | -15 =
          Creep.claimController(RoomController);
        if (ClaimResult === ERR_NOT_IN_RANGE) {
          Creep.moveTo(RoomController.pos);
        }
      }
    }
  }

  public static Spawn(
    SpawnerID: Id<StructureSpawn>,
    CreepBodyPartArray: BodyPartConstant[],
    CreepMemoryArray: CreepMemory
  ): void {
    const CreepName = CreepMemoryArray.UUID;
    try {
      const LocalSpawn = Game.getObjectById(SpawnerID);
      if (LocalSpawn) {
        if (!LocalSpawn.spawning) {
          LocalSpawn.spawnCreep(CreepBodyPartArray, CreepName, { memory: CreepMemoryArray });
        }
      }
    } catch {
      Log.Error(SpawnerID + " not a valid/existing ID of a StructureSpawner Type");
    }
  }
}
