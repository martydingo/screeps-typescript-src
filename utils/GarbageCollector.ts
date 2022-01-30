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
  }
}
