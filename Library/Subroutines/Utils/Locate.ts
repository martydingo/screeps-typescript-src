export class Locate {
  public constructor() {
    //
  }
  public static Structures = {
    Spawns(Room?: Uppercase<string>): Id<StructureSpawn>[] {
      const SpawnArray: Id<StructureSpawn>[] = [];
      for (const spawn in Game.spawns) {
        if (Room) {
          if (Game.spawns[spawn].room.name === Room) {
            SpawnArray.push(Game.spawns[spawn].id);
          }
        } else {
          SpawnArray.push(Game.spawns[spawn].id);
        }
      }
      return SpawnArray;
    }
  };
  public static Creeps = {
    CreepsByRole(Role: Uppercase<string>, Room?: Uppercase<string>): Id<Creep>[] {
      if (Room) {
        const CreepArray: Id<Creep>[] = _.filter(Game.creeps, Creep => {
          {
            return Creep.memory.Role === Role && Creep.memory.Room === Room;
          }
        }).map(Creep => {
          return Creep.id;
        });
        return CreepArray;
      } else {
        const CreepArray: Id<Creep>[] = _.filter(Game.creeps, Creep => {
          {
            return Creep.memory.Role === Role;
          }
        }).map(Creep => {
          return Creep.id;
        });
        return CreepArray;
      }
    }
  };
}
