/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ResourceInterface } from "Library/Interfaces/Memory/Resources/ResourceInterface";

export class ResourceMonitor {
  private BaseResourceMemoryArray: ResourceInterface;
  private RoomName: Uppercase<string>;
  public constructor(RoomName: Uppercase<string>) {
    this.RoomName = RoomName;
    this.BaseResourceMemoryArray = {
      Energy: {
        Dropped: {},
        Sources: {}
      }
    };
    this.__InitMemArr__();
    this.__CacheEnergySources__();
    this.__CacheDroppedEnergy__();
  }

  private __InitMemArr__() {
    if (!Memory.Resources) {
      Memory.Resources = {
        [this.RoomName]: this.BaseResourceMemoryArray
      };
    } else {
      if (!Memory.Resources[this.RoomName]) {
        Memory.Resources[this.RoomName] = this.BaseResourceMemoryArray;
      }
    }
  }
  private __CleanCaches__(): void {
    if (Memory.Resources) {
      //
    }
  }
  private __CacheDroppedEnergy__(): void {
    if (Game.rooms[this.RoomName]) {
      const DroppedEnergyArray: Resource<RESOURCE_ENERGY>[] = Game.rooms[this.RoomName].find(FIND_DROPPED_RESOURCES, {
        filter: Resource => {
          return Resource.resourceType === RESOURCE_ENERGY;
        }
      });
      DroppedEnergyArray.forEach(DroppedEnergy => {
        Memory.Resources[this.RoomName].Energy.Dropped[DroppedEnergy.id] = {
          Position: DroppedEnergy.pos,
          Amount: DroppedEnergy.amount
        };
      });
    }
  }

  private __CacheEnergySources__(): void {
    if (Game.rooms[this.RoomName]) {
      const EnergySourceArray: Source[] = Game.rooms[this.RoomName].find(FIND_SOURCES);
      EnergySourceArray.forEach(EnergySource => {
        Memory.Resources[this.RoomName].Energy.Sources[EnergySource.id] = {
          Energy: EnergySource.energy,
          Capacity: EnergySource.energyCapacity
        };
      });
    }
  }
}
