export interface SpawnerInterface {
  [key: Id<StructureSpawn>]: {
    Energy: {
      Amount: number;
      Capacity: number;
    };
  };
}
