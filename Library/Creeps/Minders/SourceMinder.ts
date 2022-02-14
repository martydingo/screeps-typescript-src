import { Log } from "Library/Subroutines/Utils/Log";
import { TemplateCreep } from "../../Templates/TemplateCreep";
import { UUID } from "../../Subroutines/Utils/UUID";

export class SourceMinder extends TemplateCreep {
  public CreepBodyPartArray: BodyPartConstant[];
  public CreepUUID = "";
  public constructor(Room: Uppercase<string>, SourceID: Id<Source>, SpawnerID?: Id<StructureSpawn>) {
    super();
    this.CreepMemoryArray.UUID = UUID.generateUUID("SOM");
    this.CreepMemoryArray.Room = Room;
    this.CreepMemoryArray.Role = "SOM";
    this.CreepMemoryArray.IDs.AssignedSource = SourceID;
    this.CreepBodyPartArray = Memory.Configuration[Room].Creeps.SOM.BodyParts;
    if (SpawnerID) {
      SourceMinder.Spawn(SpawnerID, this.CreepBodyPartArray, this.CreepMemoryArray);
    }
  }

  public static Run(CreepID: Id<Creep>): void {
    const Creep: Creep | null = Game.getObjectById(CreepID);
    if (Creep) {
      const SourceID: Id<Source> = Creep.memory.IDs.AssignedSource;
      const Source: Source | null = Game.getObjectById(SourceID);
      if (Source) {
        this.HarvestEnergySource(Creep.id, Source.id);
        if (Creep.store[RESOURCE_ENERGY] > 0) {
          Creep.drop(RESOURCE_ENERGY);
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
