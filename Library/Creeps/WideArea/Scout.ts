import { Log } from "Library/Subroutines/Utils/Log";
import { TemplateCreep } from "Library/Templates/TemplateCreep";
import { UUID } from "Library/Subroutines/Utils/UUID";
import { RoomUtil } from "Library/Subroutines/Utils/RoomUtils";

export class Scout extends TemplateCreep {
  public CreepUUID = "";
  public CreepBodyPartArray: BodyPartConstant[];
  public constructor(Room: Uppercase<string>, Spawn = false) {
    super();

    this.CreepMemoryArray.UUID = UUID.generateUUID("SCO");
    this.CreepMemoryArray.Room = Room;
    this.CreepMemoryArray.Role = "SCO";
    this.CreepBodyPartArray = [MOVE];
    if (Spawn) {
      let SpawnID: Id<StructureSpawn> | null = null;
      for (const Spawner in Game.spawns) {
        if (!Game.spawns[Spawner].spawning) {
          SpawnID = Game.spawns[Spawner].id;
        }
      }
      if (SpawnID) {
        Scout.Spawn(SpawnID, this.CreepBodyPartArray, this.CreepMemoryArray);
      } else Log.Critical("Failed to find a spawner for " + this.CreepMemoryArray.UUID.toString());
    }
  }
  public static Run(CreepID: Id<Creep>) {
    const Creep: Creep | null = Game.getObjectById(CreepID);
    if (Creep) {
      Creep.moveTo(RoomUtil.GetWalkablePos(Creep.memory.Room));
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
