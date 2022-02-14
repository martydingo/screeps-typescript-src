import { Log } from "Library/Subroutines/Utils/Log";
import { TemplateCreep } from "../../Templates/TemplateCreep";
import { UUID } from "../../Subroutines/Utils/UUID";

export class ConstructionSiteMinder extends TemplateCreep {
  public CreepBodyPartArray: BodyPartConstant[];
  public CreepUUID = "";
  public constructor(Room: Uppercase<string>, SpawnerID?: Id<StructureSpawn>) {
    super();
    this.CreepMemoryArray.UUID = UUID.generateUUID("CSM");
    this.CreepMemoryArray.Room = Room;
    this.CreepMemoryArray.Role = "CSM";
    this.CreepBodyPartArray = Memory.Configuration[Room].Creeps.CSM.BodyParts;
    if (SpawnerID) {
      ConstructionSiteMinder.Spawn(SpawnerID, this.CreepBodyPartArray, this.CreepMemoryArray);
    }
  }
  public static Run(CreepID: Id<Creep>): void {
    const Creep: Creep | null = Game.getObjectById(CreepID);
    if (Creep) {
      this.CheckResupplyRequired(Creep.id);
      if (Creep.memory.Resupplying === true) {
        this.PickupDroppedEnergy(Creep.id);
      } else {
        const RoomConstructionSiteRoomPositionArray: RoomPosition[] = [];
        const RoomConstructionSiteArray: Id<ConstructionSite>[] = [];
        for (const ConstructionSiteIDString in Memory.ConstructionSites[Creep.memory.Room]) {
          const ConstructionSiteID = ConstructionSiteIDString as Id<ConstructionSite>;
          RoomConstructionSiteArray.push(ConstructionSiteID);
        }
        if (RoomConstructionSiteArray.length < 1) {
          this.RecycleCreep(Creep.id);
        } else {
          RoomConstructionSiteArray.forEach(ConstructionSiteID => {
            const ConstructionSite: ConstructionSite | null = Game.getObjectById(ConstructionSiteID);
            if (ConstructionSite) {
              RoomConstructionSiteRoomPositionArray.push(ConstructionSite.pos);
            }
          });
          const ClosestConstructionSite = Creep.pos.findClosestByPath(RoomConstructionSiteRoomPositionArray);
          RoomConstructionSiteArray.forEach(ConstructionSiteID => {
            const ConstructionSite: ConstructionSite | null = Game.getObjectById(ConstructionSiteID);
            if (ConstructionSite) {
              if (ConstructionSite.pos === ClosestConstructionSite) {
                this.BuildConstructionSite(Creep.id, ConstructionSite.id);
              }
            }
          });
        }
      }
    }
  }
  public static BuildConstructionSite(CreepID: Id<Creep>, ConstructionSiteID: Id<ConstructionSite>): void {
    const Creep: Creep | null = Game.getObjectById(CreepID);
    if (Creep) {
      const ConstructionSite: ConstructionSite | null = Game.getObjectById(ConstructionSiteID);
      if (ConstructionSite) {
        const BuildResult: CreepActionReturnCode | -6 | -14 = Creep.build(ConstructionSite);
        if (BuildResult === ERR_NOT_IN_RANGE) {
          Creep.moveTo(ConstructionSite.pos);
        }
      }
    }
  }

  public static Spawn(
    SpawnerID: Id<StructureSpawn>,
    CreepBodyPartArray: BodyPartConstant[],
    CreepMemoryArray: CreepMemory
  ): void {
    const CreepName = CreepMemoryArray.UUID;
    try {
      const LocalSpawn = Game.getObjectById(SpawnerID);
      if (LocalSpawn) {
        if (!LocalSpawn.spawning) {
          LocalSpawn.spawnCreep(CreepBodyPartArray, CreepName, { memory: CreepMemoryArray });
        }
      }
    } catch {
      Log.Error(SpawnerID + " not a valid/existing ID of a StructureSpawner Type");
    }
  }
}
