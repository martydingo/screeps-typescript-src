export class RoomUtil {
  public static GetWalkablePos(Room: Uppercase<string>): RoomPosition {
    const TerrainData: RoomTerrain = Game.map.getRoomTerrain(Room);
    for (let x = 20; x < 30; x++) {
      for (let y = 20; y < 30; y++) {
        if (TerrainData.get(x, y) !== 1) {
          return new RoomPosition(x, y, Room);
        }
      }
    }
    return new RoomPosition(25, 25, Room);
  }
}
