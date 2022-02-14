import { Log } from "Library/Subroutines/Utils/Log";
import { TemplateCreep } from "../../Templates/TemplateCreep";
import { UUID } from "../../Subroutines/Utils/UUID";

export class SpawnMinder extends TemplateCreep {
  private CreepBodyPartArray: BodyPartConstant[];
  public constructor(Room: Uppercase<string>, SpawnID?: Id<StructureSpawn>) {
    super();
    this.CreepMemoryArray.UUID = UUID.generateUUID("SPM");
    this.CreepMemoryArray.Room = Room;
    this.CreepMemoryArray.Role = "SPM";
    this.CreepBodyPartArray = Memory.Configuration[Room].Creeps.SOM.BodyParts;
    if (SpawnID) {
      SpawnMinder.Spawn(SpawnID, this.CreepBodyPartArray, this.CreepMemoryArray);
    }
  }

  public static Run(CreepID: Id<Creep>): void {
    const Creep: Creep | null = Game.getObjectById(CreepID);
    if (Creep) {
      let CreepAction = false;
      this.CheckResupplyRequired(Creep.id);
      if (Creep.memory.Resupplying === true) {
        this.PickupDroppedEnergy(Creep.id);
        CreepAction = true;
      } else {
        const SpawnerStructures: Id<StructureSpawn>[] = [];
        for (const SpawnIDString in Memory.Structures[Creep.memory.Room].Spawners) {
          const SpawnID = SpawnIDString as Id<StructureSpawn>;
          const EnergyAmount: number = Memory.Structures[Creep.memory.Room].Spawners[SpawnID].Energy.Amount;
          const EnergyCapacity: number = Memory.Structures[Creep.memory.Room].Spawners[SpawnID].Energy.Capacity;
          if (EnergyAmount < EnergyCapacity) {
            SpawnerStructures.push(SpawnID);
          }
        }
        const ExtensionStructures: Id<StructureExtension>[] = [];
        for (const ExtensionIDString in Memory.Structures[Creep.memory.Room].Extensions) {
          const ExtensionID = ExtensionIDString as Id<StructureExtension>;
          const EnergyAmount: number = Memory.Structures[Creep.memory.Room].Extensions[ExtensionID].Energy.Amount;
          const EnergyCapacity: number = Memory.Structures[Creep.memory.Room].Extensions[ExtensionID].Energy.Capacity;
          if (EnergyAmount < EnergyCapacity) {
            ExtensionStructures.push(ExtensionID);
          }
        }
        ExtensionStructures.forEach(ExtensionID => {
          const Extension: StructureExtension | null = Game.getObjectById(ExtensionID);
          if (Extension) {
            this.DepositResource(Creep.id, Extension.id, RESOURCE_ENERGY);
            CreepAction = true;
          }
        });
        if (CreepAction === false) {
          SpawnerStructures.forEach(SpawnID => {
            const Spawn: StructureSpawn | null = Game.getObjectById(SpawnID);
            if (Spawn) {
              this.DepositResource(Creep.id, Spawn.id, RESOURCE_ENERGY);
              CreepAction = true;
            }
          });
        }
      }
    }
  }

  private static Spawn(
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
