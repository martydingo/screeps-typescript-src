import { RoomUtil } from "Library/Subroutines/Utils/RoomUtils";
import { Scout } from "Library/Creeps/WideArea/Scout";

export class ScoutMonitor {
  public constructor(Room: Uppercase<string>) {
    const ScoutCreeps: Id<Creep>[] = _.filter(Game.creeps, Creep => {
      {
        return Creep.memory.Role === "SCO" && Creep.memory.Room === Room;
      }
    }).map(Creep => {
      return Creep.id;
    });
    if (ScoutCreeps.length <= 0) {
      new Scout(Room);
    }
    ScoutCreeps.forEach(CreepID => {
      ScoutMonitor.OperateCreeps(CreepID, Room);
    });
  }
  public static OperateCreeps(CreepID: Id<Creep>, Room: Uppercase<string>): void {
    const Creep: Creep | null = Game.getObjectById(CreepID);
    if (Creep) {
      const ScoutPerch: RoomPosition = RoomUtil.GetWalkablePos(Room);
      if (ScoutPerch) {
        Creep.moveTo(ScoutPerch);
      }
    }
  }
}
