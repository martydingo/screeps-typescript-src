export class GarbageCollector {
  public static Run(): void {
    GarbageCollector.cleanCreepMemory();
  }
  private static cleanCreepMemory(): void {
    for (const creepName in Memory.creeps) {
      if (!(creepName in Game.creeps)) {
        delete Memory.creeps[creepName];
      }
    }
    for (const RoomName in Memory.Structures) {
      for (const CachedDroppedEnergyIDString in Memory.Resources[RoomName].Energy.Dropped) {
        const CachedDroppedEnergyID = CachedDroppedEnergyIDString as Id<Resource>;
        const CachedDroppedEnergy: Resource | null = Game.getObjectById(CachedDroppedEnergyID);
        if (!CachedDroppedEnergy) {
          const CachedDroppedEnergyIDTyped = CachedDroppedEnergyID as Id<Resource<RESOURCE_ENERGY>>;
          delete Memory.Resources[RoomName].Energy.Dropped[CachedDroppedEnergyIDTyped];
        }
      }
    }
  }
}
