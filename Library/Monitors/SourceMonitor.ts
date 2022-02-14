import { Locate } from "Library/Subroutines/Utils/Locate";
import { Log } from "Library/Subroutines/Utils/Log";
import { SourceMinder } from "Library/Creeps/Minders/SourceMinder";

export class SourceMonitor {
  public constructor(Room: Uppercase<string>) {
    SourceMonitor.CacheSources(Room);
    SourceMonitor.AssignSources(Room);
  }
  public static OperateCreeps(): void {
    for (const CreepName in Game.creeps) {
      if (Game.creeps[CreepName].memory.Role === "SOM") {
        SourceMinder.Run(Game.creeps[CreepName].id);
      }
    }
  }
  public static AssignSources(Room: Uppercase<string>): void {
    if (Memory.Structures) {
      if (Memory.Structures[Room]) {
        if (Memory.Structures[Room].Sources) {
          for (const CachedSourceIndex in Memory.Structures[Room].Sources) {
            const AssignedCreep: Id<Creep> | null = Memory.Structures[Room].Sources[CachedSourceIndex].AssignedCreep;
            const SourceID = Memory.Structures[Room].Sources[CachedSourceIndex].ID;
            if (AssignedCreep === null) {
              Log.Informational("Unassigned source discovered: " + SourceID.toString() + ", spawning Source Minder");
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              this.spawnMinder(Room, SourceID);
              for (const CreepName in Game.creeps) {
                if (Game.creeps[CreepName].memory.IDs) {
                  if (Game.creeps[CreepName].memory.IDs.AssignedSource === SourceID) {
                    Memory.Structures[Room].Sources[CachedSourceIndex].AssignedCreep = Game.creeps[CreepName].id;
                  }
                }
              }
            } else {
              if (!Game.getObjectById(AssignedCreep)) {
                Memory.Structures[Room].Sources[CachedSourceIndex].AssignedCreep = null;
              }
            }
          }
        }
      }
    }
  }
  public static CacheSources(Room: Uppercase<string>): void {
    if (Memory.Structures) {
      if (Memory.Structures[Room]) {
        if (Memory.Structures[Room].Sources) {
          /* Skip Caching Operation */
        } else {
          Memory.Structures[Room].Sources = {};
          const RoomSources = Game.rooms[Room].find(FIND_SOURCES);
          for (let i = 0; i < RoomSources.length; i++) {
            const Index: number = i + 1;
            Memory.Structures[Room].Sources[Index] = { ID: RoomSources[i].id, AssignedCreep: null };
          }
        }
      } else {
        Memory.Structures[Room] = { Sources: {}, ConstructionSites: {}, Spawners: {}, Extensions: {} };
        const RoomSources = Game.rooms[Room].find(FIND_SOURCES);
        for (let i = 0; i < RoomSources.length; i++) {
          const Index: number = i + 1;
          Memory.Structures[Room].Sources[Index] = { ID: RoomSources[i].id, AssignedCreep: null };
        }
      }
    } else {
      Memory.Structures = {};
    }
    //
  }

  public static spawnMinder(Room: Uppercase<string>, SourceID: Id<Source>): void {
    const Spawns: Id<StructureSpawn>[] = Locate.Structures.Spawns(Room);
    if (Spawns.length < 1) {
      for (const SpawnName in Game.spawns) {
        const Spawn = Game.spawns[SpawnName];
        if (Spawn) {
          Spawns.push(Spawn.id);
        }
      }
    }
    Spawns.forEach(SpawnID => {
      const LocalSpawn = Game.getObjectById(SpawnID);
      if (LocalSpawn) {
        if (!LocalSpawn.spawning) {
          new SourceMinder(Room, SourceID, SpawnID);
        } else {
          Log.Warning(
            LocalSpawn.toString() +
              ": refused spawning a creep with the role of 'SOM' due to the spawner already spawning a creep."
          );
        }
      }
    });
  }
}
