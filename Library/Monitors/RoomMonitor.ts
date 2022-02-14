import { ConstructionSiteMonitor } from "./ConstructionSiteMonitor";
import { MonitoringMonitor } from "./MonitoringMonitor";
import { ResourceMonitor } from "Library/Monitors/ResourceMonitor";
import { RespawnMonitor } from "./RespawnMonitor";
import { StructureMonitor } from "./StructureMonitor";

export class RoomMonitor {
  public constructor(RoomName: Uppercase<string>) {
    const Room: Room | undefined = Game.rooms[RoomName];
    if (Room) {
      new MonitoringMonitor(RoomName);
      new ResourceMonitor(RoomName);
      new StructureMonitor(RoomName);
      new ConstructionSiteMonitor(RoomName);

      for (const Role in Memory.Configuration[RoomName].Creeps) {
        new RespawnMonitor(RoomName, Role);
      }
    } else {
      new RespawnMonitor(RoomName, "SCO");
    }
  }
}
