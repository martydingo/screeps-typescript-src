export class StructureMonitor {
  private RoomName: Uppercase<string>;
  public constructor(RoomName: Uppercase<string>) {
    this.RoomName = RoomName;

    this.__InitMemArr__();
    this.__CacheSpawns__();
    this.__CacheExtensions__();
  }
  private __InitMemArr__(): void {
    if (!Memory.Structures) {
      Memory.Structures = {
        [this.RoomName]: {
          Spawners: {},
          Extensions: {}
        }
      };
    }
  }
  private __CacheSpawns__() {
    for (const SpawnName in Game.spawns) {
      const Spawn: StructureSpawn = Game.spawns[SpawnName];
      if (Spawn.pos.roomName === this.RoomName) {
        Memory.Structures[this.RoomName].Spawners[Spawn.id] = {
          Energy: {
            Amount: Spawn.store[RESOURCE_ENERGY],
            Capacity: Spawn.store.getCapacity(RESOURCE_ENERGY)
          }
        };
      }
    }
  }
  private __CacheExtensions__() {
    if (Game.rooms[this.RoomName]) {
      const Room: Room = Game.rooms[this.RoomName];
      const RoomExtensionArray: StructureExtension[] = Room.find(FIND_MY_STRUCTURES, {
        filter: Structure => {
          return Structure.structureType === STRUCTURE_EXTENSION;
        }
      });
      RoomExtensionArray.forEach(Extension => {
        Memory.Structures[this.RoomName].Extensions[Extension.id] = {
          Energy: {
            Amount: Extension.store[RESOURCE_ENERGY],
            Capacity: Extension.store.getCapacity(RESOURCE_ENERGY)
          }
        };
      });
    }
  }
}
