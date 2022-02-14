import { Base64 } from "./Base64";
import { Log } from "./Log";
import { PathfinderOptions } from "./PathfinderOptions";

export interface PathFinderGoal {
  pos: RoomPosition;
  range: number;
}

export class Pathfinder {
  public static FindPath(CreepID: Id<Creep>, Destination: RoomPosition, Range = 0): RoomPosition[] | undefined {
    const PathfinderOpts: PathFinderOpts = PathfinderOptions.Default;
    const Goal: PathFinderGoal = { pos: Destination, range: Range };
    const Creep: Creep | null = Game.getObjectById(CreepID);
    if (Creep) {
      return PathFinder.search(Creep.pos, Goal, PathfinderOpts).path;
    } else {
      Log.Error("Path Not Calculated");
      return undefined;
    }
  }

  //   public static EncodePath(Path: RoomPosition[]) {
  //     //
  //   }

  //   public static LoadPathFromMemory(): RoomPosition[] {
  //     //
  //   }
  //   public static SavePathToMemory
}
