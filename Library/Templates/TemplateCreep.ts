import { Base64 } from "Library/Subroutines/Utils/Base64";
import { Log } from "Library/Subroutines/Utils/Log";
import { Pathfinder } from "Library/Subroutines/Utils/Pathfinder";

export class TemplateCreep {
  public CreepMemoryArray: CreepMemory;

  public constructor() {
    this.CreepMemoryArray = {
      UUID: "",
      RoomBound: true,
      Role: "",
      Resupplying: false,
      RoleMetadata: {},
      Room: "",
      IDs: {},
      Tasks: {},
      CreepMon: {
        PreviousPosition: {
          X: 0,
          Y: 0,
          RoomName: "",
          Time: Game.time
        }
      }
    };
  }
  public static MoveTo(CreepID: Id<Creep>, Destination: RoomPosition): void {
    const Creep: Creep | null = Game.getObjectById(CreepID);
    if (Creep) {
      if (Creep.memory.CreepMon) {
        if (
          Creep.memory.CreepMon.PreviousPosition.X !== Creep.pos.x ||
          Creep.memory.CreepMon.PreviousPosition.Y !== Creep.pos.y
        ) {
          Creep.memory.CreepMon.PreviousPosition.X = Creep.pos.x;
          Creep.memory.CreepMon.PreviousPosition.Y = Creep.pos.y;
          Creep.memory.CreepMon.PreviousPosition.RoomName = Creep.pos.roomName;
        }
      }
      const OriginHash: string = Base64.encode(JSON.stringify(Creep?.pos));
      const DestinationHash: string = Base64.encode(JSON.stringify(Destination));
      if (Memory.PathCache[DestinationHash]) {
        if (Memory.PathCache[DestinationHash][OriginHash]) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const Path: RoomPosition[] = JSON.parse(Base64.decode(Memory.PathCache[DestinationHash][OriginHash]));
          if (Path[0]) {
            if (Path[1]) {
              if (Path[1] === Creep.pos) {
                Log.Alert(Creep.name + " is stuck in a path loop!");
                Log.Alert(Path[1].toString() + " matches" + Creep.pos.toString());
              }
            } else {
              Log.Warning(Creep.name + " has no path past next step.");
            }
            Log.Debug("Creep: " + Creep.name + " has moved via PathCache");
            Creep.move(Creep.pos.getDirectionTo(Path[0].x, Path[0].y));
            if (
              Creep.pos.x === Creep.memory.CreepMon.PreviousPosition.X &&
              Creep.pos.y === Creep.memory.CreepMon.PreviousPosition.Y
            ) {
              const TimeSinceCreepLastMoved: number = Game.time - Creep.memory.CreepMon.PreviousPosition.Time;
              if (Creep.memory.Role !== "SOM") {
                Log.Warning(Creep.name + " has not moved for " + TimeSinceCreepLastMoved.toString() + " ticks");
                if (TimeSinceCreepLastMoved > 100) {
                  delete Memory.PathCache[DestinationHash][OriginHash];
                  Creep.move(TOP);
                  Creep.move(TOP_RIGHT);
                  Creep.move(RIGHT);
                  Creep.move(BOTTOM_RIGHT);
                  Creep.move(BOTTOM);
                  Creep.move(BOTTOM_LEFT);
                  Creep.move(LEFT);
                  Creep.move(TOP_LEFT);
                }
              }
            }
          }
        } else {
          const Path: RoomPosition[] | undefined = Pathfinder.FindPath(Creep.id, Destination, 1);
          if (Path) {
            const PathHash: string = Base64.encode(JSON.stringify(Path));
            Memory.PathCache[DestinationHash][OriginHash] = PathHash;
            Creep.moveByPath(Path);
          }
        }
      } else {
        Memory.PathCache[DestinationHash] = {};
        const Path: RoomPosition[] | undefined = Pathfinder.FindPath(Creep.id, Destination, 1);
        if (Path) {
          const PathHash: string = Base64.encode(JSON.stringify(Path));

          Memory.PathCache[DestinationHash][OriginHash] = PathHash;
          Creep.moveByPath(Path);
        }
      }
    }
  }
  public static HarvestEnergySource(CreepID: Id<Creep>, SourceID: Id<Source>): void {
    const Source: Source | null = Game.getObjectById(SourceID);
    const Creep: Creep | null = Game.getObjectById(CreepID);
    if (Source && Creep) {
      const HarvestResult: CreepActionReturnCode | ERR_NOT_FOUND | ERR_NOT_ENOUGH_ENERGY = Creep.harvest(Source);
      if (HarvestResult === ERR_NOT_IN_RANGE) {
        Creep.moveTo(Source.pos);
      }
    }
  }
  public static RecycleCreep(CreepID: Id<Creep>): void {
    const Creep: Creep | null = Game.getObjectById(CreepID);
    if (Creep) {
      const SpawnerIDArray: Id<StructureSpawn>[] = [];
      for (const SpawnerIDString in Memory.Structures[Creep.memory.Room].Spawners) {
        const SpawnerID: Id<StructureSpawn> = SpawnerIDString as Id<StructureSpawn>;
        SpawnerIDArray.push(SpawnerID);
      }
      if (SpawnerIDArray) {
        const Spawner: StructureSpawn | null = Game.getObjectById(SpawnerIDArray[0]);
        if (Spawner) {
          const RecycleResult: ScreepsReturnCode = Spawner.recycleCreep(Creep);
          if (RecycleResult === ERR_NOT_IN_RANGE) {
            Creep.moveTo(Spawner);
          }
        }
      }
    }
  }
  public static DepositResource(
    CreepID: Id<Creep>,
    TargetContainerID: Id<Structure<StructureConstant>>,
    Resource: ResourceConstant = RESOURCE_ENERGY
  ): void {
    const TargetContainer: Structure<StructureConstant> | null = Game.getObjectById(TargetContainerID);
    if (TargetContainer) {
      const Creep: Creep | null = Game.getObjectById(CreepID);
      if (Creep) {
        const DepositResult: CreepActionReturnCode | -6 | -5 | -10 | -2 | -3 | -8 | -14 | -15 = Creep.transfer(
          TargetContainer,
          Resource
        );
        if (DepositResult === ERR_NOT_IN_RANGE) {
          Creep.moveTo(TargetContainer.pos);
        }
      }
    }
  }
  public static PickupDroppedEnergy(CreepID: Id<Creep>): void {
    const Creep: Creep | null = Game.getObjectById(CreepID);
    if (Creep) {
      const DroppedEnergyMatrix: Resource<ResourceConstant>[] = [];
      for (const CachedDroppedEnergyIDString in Memory.Resources[Creep.memory.Room].Energy.Dropped) {
        const CachedDroppedEnergyID = CachedDroppedEnergyIDString as Id<Resource>;
        const CachedDroppedEnergy: Resource<ResourceConstant> | null = Game.getObjectById(CachedDroppedEnergyID);
        if (CachedDroppedEnergy) {
          Log.Debug(Creep.name + " picking up cached resource " + CachedDroppedEnergy.toString());
          DroppedEnergyMatrix.push(CachedDroppedEnergy);
        }
      }

      const ClosestDroppedEnergy: Resource<ResourceConstant> | null = Creep.pos.findClosestByRange(DroppedEnergyMatrix);
      if (ClosestDroppedEnergy) {
        const PickupResult: CreepActionReturnCode | -8 = Creep.pickup(ClosestDroppedEnergy);
        if (PickupResult === ERR_NOT_IN_RANGE) {
          Creep.moveTo(ClosestDroppedEnergy.pos);
        }
      }
    }
  }

  public static CheckResupplyRequired(CreepID: Id<Creep>): void {
    const Creep: Creep | null = Game.getObjectById(CreepID);
    if (Creep) {
      const CurrentStoreUsed: number = Creep.store.getUsedCapacity();
      const MaximumStoreCapacity: number = Creep.store.getCapacity();
      if (CurrentStoreUsed === MaximumStoreCapacity) {
        Creep.memory.Resupplying = false;
      } else {
        if (CurrentStoreUsed === 0) {
          Creep.memory.Resupplying = true;
        }
      }
    }
  }
}
