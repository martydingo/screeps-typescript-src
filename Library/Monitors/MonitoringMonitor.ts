import { GlobalConstants } from "Configuration/Global/Constants";

export interface MonitoringRootMemoryStructure {
  [key: Uppercase<string>]: {
    Energy: EnergyMonitoringMemoryStructure;
  };
}

export interface EnergyMonitoringMemoryStructure {
  Spawns: {
    Amount: number;
    Capacity: number;
  };
  Storage: {
    Amount: number;
    Capacity: number;
  };
}

export class MonitoringMonitor {
  private Roles: Uppercase<string>[];
  private RoomName: Uppercase<string>;
  public constructor(RoomName: Uppercase<string>) {
    this.RoomName = RoomName;
    this.Roles = GlobalConstants.Roles;

    this.__InitMemArr__();
    this.RunMonitors();
  }

  private __InitMemArr__(): void {
    if (!Memory.Monitoring) {
      Memory.Monitoring = {
        [this.RoomName]: {
          Energy: {
            Spawns: {
              Amount: 0,
              Capacity: 0
            },
            Storage: {
              Amount: 0,
              Capacity: 0
            }
          }
        }
      };
    } else {
      if (!Memory.Monitoring[this.RoomName]) {
        Memory.Monitoring[this.RoomName] = {
          Energy: {
            Spawns: {
              Amount: 0,
              Capacity: 0
            },
            Storage: {
              Amount: 0,
              Capacity: 0
            }
          }
        };
      }
    }
  }
  private RoomEnergyMonitor(): void {
    const MonitoredRoom: Room = Game.rooms[this.RoomName];
    if (MonitoredRoom) {
      Memory.Monitoring[this.RoomName].Energy = {
        Spawns: {
          Amount: MonitoredRoom.energyAvailable,
          Capacity: MonitoredRoom.energyCapacityAvailable
        },
        Storage: {
          Amount: MonitoredRoom.storage?.store[RESOURCE_ENERGY] ?? 0,
          Capacity: MonitoredRoom.storage?.store.getFreeCapacity(RESOURCE_ENERGY) ?? 0
        }
      };
    }
  }
  private RunMonitors(): void {
    this.RoomEnergyMonitor();
  }
}
