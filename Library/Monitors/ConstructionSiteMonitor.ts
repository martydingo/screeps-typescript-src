import { Log } from "Library/Subroutines/Utils/Log";

export class ConstructionSiteMonitor {
  private RoomName: Uppercase<string>;
  public constructor(Room: Uppercase<string>) {
    this.RoomName = Room;
    this.__InitMemVars__();
    this.__CleanConstructionSiteCache__();
    this.__CacheConstructionSites__();
  }

  private __InitMemVars__(): void {
    if (!Memory.ConstructionSites) {
      Memory.ConstructionSites = { [this.RoomName]: {} };
    } else {
      if (!Memory.ConstructionSites[this.RoomName]) {
        Memory.ConstructionSites[this.RoomName] = {};
      }
    }
  }

  private __CleanConstructionSiteCache__(): void {
    if (Memory.ConstructionSites) {
      if (Memory.ConstructionSites[this.RoomName]) {
        if (Memory.ConstructionSites[this.RoomName]) {
          for (const CachedConstructionSiteIDString in Memory.ConstructionSites[this.RoomName]) {
            const ConstructionSiteID: Id<ConstructionSite> = CachedConstructionSiteIDString as Id<ConstructionSite>;
            const ConstructionSite: ConstructionSite | null = Game.getObjectById(ConstructionSiteID);
            if (!ConstructionSite) {
              Log.Debug("Construction Site" + CachedConstructionSiteIDString + " not a valid construction site");
              Log.Debug("Clearing " + CachedConstructionSiteIDString + "from the  construction site cache");
              Log.Debug("Deleting \n " + JSON.stringify(Memory.ConstructionSites[this.RoomName][ConstructionSiteID]));
              delete Memory.ConstructionSites[this.RoomName][ConstructionSiteID];
            }
          }
        }
      }
    }
  }

  private __CacheConstructionSites__(): void {
    const RoomConstructionSites = Game.rooms[this.RoomName].find(FIND_MY_CONSTRUCTION_SITES);
    RoomConstructionSites.forEach(ConstructionSite => {
      const ProgressPercentage: number = (ConstructionSite.progress / ConstructionSite.progressTotal) * 100;
      Memory.ConstructionSites[this.RoomName][ConstructionSite.id] = {
        Progress: ConstructionSite.progress,
        ProgressTotal: ConstructionSite.progressTotal,
        ProgressPercentage: ProgressPercentage.toString() + "%"
      };
    });
  }
}
