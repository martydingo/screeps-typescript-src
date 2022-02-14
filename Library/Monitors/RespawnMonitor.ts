import { Base64 } from "Library/Subroutines/Utils/Base64";
import { CreepConfiurationInterface } from "Library/Interfaces/Memory/Configuration/CreepConfigurationInterface";
import { CreepUtils } from "Library/Subroutines/Utils/CreepUtils";
import { RespawnQueueEntry } from "Library/Interfaces/Memory/Respawn/RespawnQueue";
import { RespawnRoles } from "Library/Interfaces/Memory/Respawn/RespawnRoles";
import { SourceMinder } from "Library/Creeps/Minders/SourceMinder";
import { SpawnMinder } from "Library/Creeps/Minders/SpawnMinder";
import { RoomControllerMinder } from "Library/Creeps/Minders/RoomControllerMinder";
import { ConstructionSiteMinder } from "Library/Creeps/Minders/ConstructionSiteMinder";
import { Scout } from "Library/Creeps/WideArea/Scout";

export class RespawnMonitor {
  private Role: Uppercase<string>;
  private RoomName: Uppercase<string>;
  private RespawnRoleArray: RespawnRoles;
  private RoleConfigurationArray: CreepConfiurationInterface;
  public constructor(RoomName: Uppercase<string>, Role: Uppercase<string>) {
    this.RoomName = RoomName;
    this.Role = Role;
    this.RespawnRoleArray = { SOM: {}, SPM: {}, RCM: {}, CSM: {}, SCO: {} };
    this.RoleConfigurationArray = Memory.Configuration[this.RoomName].Creeps;
    this.__InitMemArr__();
    this.__RunRespawnLoop__();
  }

  // private __InitSourcesMemArr__(): void {}
  private __InitRoleMemArr__(): void {
    switch (this.Role) {
      case "SOM":
        if (Memory.Resources[this.RoomName].Energy.Sources) {
          for (const SourceIDString in Memory.Resources[this.RoomName].Energy.Sources) {
            const SourceID = SourceIDString as Id<Source>;
            if (Memory.Respawn[this.RoomName].Roles[this.Role]) {
              if (!Memory.Respawn[this.RoomName].Roles[this.Role][SourceID]) {
                Memory.Respawn[this.RoomName].Roles[this.Role][SourceID] = {
                  AssignedCreep: null
                };
              }
            }
          }
        }
        break;
      case "SPM":
        if (Memory.Respawn[this.RoomName].Roles[this.Role]) {
          Memory.Respawn[this.RoomName].Roles[this.Role] = {
            DesiredCreepCount: Memory.Configuration[this.RoomName].Creeps.SPM.DesiredCreepCount,
            CurrentCreepCount: this.__FetchCreepCount__()
          };
        }
        break;
      case "SCO":
        if (Memory.Respawn[this.RoomName].Roles[this.Role]) {
          Memory.Respawn[this.RoomName].Roles[this.Role] = {
            CurrentCreepCount: this.__FetchCreepCount__()
          };
        }
        break;
      case "RCM":
        if (Memory.Respawn[this.RoomName].Roles[this.Role]) {
          Memory.Respawn[this.RoomName].Roles[this.Role] = {
            CurrentCreepCount: this.__FetchCreepCount__()
          };
        }
        break;
      case "CSM":
        if (Memory.Respawn[this.RoomName].Roles[this.Role]) {
          Memory.Respawn[this.RoomName].Roles[this.Role] = {
            CurrentCreepCount: this.__FetchCreepCount__()
          };
        }
        break;
    }
  }

  private __InitMemArr__(): void {
    if (!Memory.Respawn) {
      Memory.Respawn = {
        [this.RoomName]: {
          Roles: this.RespawnRoleArray,
          Queue: {}
        }
      };
    } else if (!Memory.Respawn[this.RoomName]) {
      Memory.Respawn[this.RoomName] = {
        Roles: this.RespawnRoleArray,
        Queue: {}
      };
    }
  }

  private __GenerateQueueUUID__(
    RoomName: Uppercase<string>,
    Role: Uppercase<string>,
    IDAssignment?: Id<Source> | Id<StructureSpawn>
  ): string {
    const StringifiedIDAssignment = IDAssignment?.toString();
    if (StringifiedIDAssignment) {
      const QueueUUID: string = Base64.encode(RoomName + Role + StringifiedIDAssignment);
      return QueueUUID;
    } else {
      const QueueUUID: string = Base64.encode(RoomName + Role);
      return QueueUUID;
    }
  }
  private __RCMQueueOperations__(): void {
    const ClaimMode = Memory.Configuration[this.RoomName].Creeps.RCM.ClaimMode;
    const Priority: number = this.RoleConfigurationArray.RCM.Priority;

    const RoomControllerMinderCount: number = Memory.Respawn[this.RoomName].Roles.RCM.CurrentCreepCount as number;
    const QueueUID = this.__GenerateQueueUUID__(this.RoomName, this.Role);
    if (RoomControllerMinderCount < 1) {
      if (!Memory.Respawn[this.RoomName].Queue[QueueUID]) {
        Memory.Respawn[this.RoomName].Queue[QueueUID] = {
          Role: this.Role,
          Room: this.RoomName,
          ClaimMode,
          Priority,
          CreationTime: Game.time
        };
      }
    } else {
      if (Memory.Respawn[this.RoomName].Queue[QueueUID]) {
        delete Memory.Respawn[this.RoomName].Queue[QueueUID];
      }
    }
  }

  private __SPMQueueOperations__(): void {
    const DesiredSPMCount: number = Memory.Respawn[this.RoomName].Roles.SPM.DesiredCreepCount;
    const CurrentSPMCount: number = Memory.Respawn[this.RoomName].Roles.SPM.CurrentCreepCount;
    const QueueUID = this.__GenerateQueueUUID__(this.RoomName, this.Role);
    if (CurrentSPMCount < DesiredSPMCount) {
      const Priority: number = this.RoleConfigurationArray.SPM.Priority;
      if (!Memory.Respawn[this.RoomName].Queue[QueueUID]) {
        Memory.Respawn[this.RoomName].Queue[QueueUID] = {
          Role: this.Role,
          Room: this.RoomName,
          Priority,
          CreationTime: Game.time
        };
      }
    } else {
      if (Memory.Respawn[this.RoomName].Queue[QueueUID]) {
        delete Memory.Respawn[this.RoomName].Queue[QueueUID];
      }
    }
  }
  private __SCOQueueOperations__(): void {
    let DesiredSCOCount = 0;
    const CurrentSCOCount: number = Memory.Respawn[this.RoomName].Roles.SCO.CurrentCreepCount;
    if (!Game.rooms[this.RoomName]) {
      DesiredSCOCount = 1;
    }
    const QueueUID = this.__GenerateQueueUUID__(this.RoomName, this.Role);
    if (CurrentSCOCount < DesiredSCOCount) {
      const Priority: number = this.RoleConfigurationArray.SCO.Priority;
      if (!Memory.Respawn[this.RoomName].Queue[QueueUID]) {
        Memory.Respawn[this.RoomName].Queue[QueueUID] = {
          Role: this.Role,
          Room: this.RoomName,
          Priority,
          CreationTime: Game.time
        };
      }
    } else {
      if (Memory.Respawn[this.RoomName].Queue[QueueUID]) {
        delete Memory.Respawn[this.RoomName].Queue[QueueUID];
      }
    }
  }
  private __CSMQueueOperations__(): void {
    const QueueUID = this.__GenerateQueueUUID__(this.RoomName, this.Role);
    const ConstructionSiteArray = Memory.ConstructionSites[this.RoomName];
    let ConstructionSiteCount = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const ConstructionSiteIDString in ConstructionSiteArray) {
      ConstructionSiteCount++;
    }
    const CurrentCSMCount: number = Memory.Respawn[this.RoomName].Roles.CSM.CurrentCreepCount as number;
    if (ConstructionSiteCount > 0) {
      if (CurrentCSMCount < ConstructionSiteCount) {
        const Priority: number = this.RoleConfigurationArray.CSM.Priority;
        if (!Memory.Respawn[this.RoomName].Queue[QueueUID]) {
          Memory.Respawn[this.RoomName].Queue[QueueUID] = {
            Role: this.Role,
            Room: this.RoomName,
            Priority,
            CreationTime: Game.time
          };
        }
      } else {
        if (Memory.Respawn[this.RoomName].Queue[QueueUID]) {
          delete Memory.Respawn[this.RoomName].Queue[QueueUID];
        }
      }
    } else {
      if (Memory.Respawn[this.RoomName].Queue[QueueUID]) {
        delete Memory.Respawn[this.RoomName].Queue[QueueUID];
      }
    }
  }

  private __SOMQueueOperations__(): void {
    for (const SourceIDString in Memory.Respawn[this.RoomName].Roles.SOM) {
      const SourceID = SourceIDString as Id<Source>;
      if (Memory.Respawn[this.RoomName].Roles.SOM[SourceID].AssignedCreep === null) {
        const Priority: number = this.RoleConfigurationArray.SOM.Priority;
        const QueueUID = this.__GenerateQueueUUID__(this.RoomName, this.Role, SourceID);
        if (!Memory.Respawn[this.RoomName].Queue[QueueUID]) {
          Memory.Respawn[this.RoomName].Queue[QueueUID] = {
            Role: this.Role,
            Room: this.RoomName,
            AssignedID: SourceID,
            Priority,
            CreationTime: Game.time
          };
        }
      } else {
        const CreepID: Id<Creep> | null = Memory.Respawn[this.RoomName].Roles.SOM[SourceID].AssignedCreep;
        if (CreepID) {
          if (!Game.getObjectById(CreepID)) {
            Memory.Respawn[this.RoomName].Roles.SOM[SourceID].AssignedCreep = null;
          }
        } else {
          Memory.Respawn[this.RoomName].Roles.SOM[SourceID].AssignedCreep = null;
        }
      }
    }
  }

  private __RunQueueOperations__() {
    this.__ReassignIDs__();
    this.__QueueCreepsToSpawn__();
  }

  private __FetchCreepCount__() {
    let CreepCount = 0;
    for (const CreepName in Game.creeps) {
      const Creep: Creep = Game.creeps[CreepName];
      if (Creep.memory.Role === this.Role && Creep.memory.Room === this.RoomName) {
        CreepCount++;
      }
    }
    return CreepCount;
  }

  private __QueueCreepsToSpawn__() {
    switch (this.Role) {
      case "SOM":
        this.__SOMQueueOperations__();
        break;
      case "SPM":
        this.__SPMQueueOperations__();
        break;
      case "RCM":
        this.__RCMQueueOperations__();
        break;
      case "CSM":
        this.__CSMQueueOperations__();
        break;
      case "SCO":
        this.__SCOQueueOperations__();
        break;
    }
  }

  private __GetCurrentPriority__(): number | undefined {
    const QueuedPriorityArray: number[] = [];
    for (const QueueID in Memory.Respawn[this.RoomName].Queue) {
      const QueueEntry = Memory.Respawn[this.RoomName].Queue[QueueID];
      if (QueueEntry) {
        QueuedPriorityArray.push(QueueEntry.Priority);
      }
    }
    if (QueuedPriorityArray.length < 1) {
      return undefined;
    }
    return QueuedPriorityArray.sort()[0];
  }

  private __ReassignIDs__() {
    for (const QueueID in Memory.Respawn[this.RoomName].Queue) {
      const QueuedRequest: RespawnQueueEntry | null = Memory.Respawn[this.RoomName].Queue[QueueID];
      if (QueuedRequest) {
        if (QueuedRequest.AssignedID) {
          if (QueuedRequest.Role === "SOM") {
            const QueuedSourceID = QueuedRequest.AssignedID as Id<Source>;
            for (const CreepName in Game.creeps) {
              const Creep: Creep = Game.creeps[CreepName];
              if (Creep.memory.IDs) {
                if (Creep.memory.IDs.AssignedSource === QueuedSourceID) {
                  Memory.Respawn[this.RoomName].Roles.SOM[QueuedSourceID].AssignedCreep = Creep.id;
                  delete Memory.Respawn[this.RoomName].Queue[QueueID];
                }
              }
            }
          } else {
            if (QueuedRequest.Role === "SPM") {
              const QueuedSpawnID = QueuedRequest.AssignedID as Id<StructureSpawn>;
            }
          }
          //
        }
      }
    }
  }

  private __RunSpawnOperations__() {
    for (const QueueID in Memory.Respawn[this.RoomName].Queue) {
      const QueuedRequest: RespawnQueueEntry | null = Memory.Respawn[this.RoomName].Queue[QueueID];
      const CurrentPriority: number | undefined = this.__GetCurrentPriority__();
      if (QueuedRequest) {
        if (CurrentPriority) {
          if (CurrentPriority === QueuedRequest.Priority) {
            const Role: Uppercase<string> = QueuedRequest.Role;
            if (this.__SpawnPrerequisitesMet__()) {
              const Spawn: StructureSpawn | boolean = this.__FetchSpawn__();
              if (Spawn && Spawn !== true) {
                switch (Role) {
                  case "SOM":
                    if (QueuedRequest.AssignedID) {
                      const AssignedObject: Source | StructureSpawn | null = Game.getObjectById(
                        QueuedRequest.AssignedID
                      );
                      if (AssignedObject) {
                        new SourceMinder(this.RoomName, QueuedRequest.AssignedID as Id<Source>, Spawn.id);
                      }
                    }
                    return;
                  case "SPM":
                    new SpawnMinder(this.RoomName, Spawn.id);
                    return;
                  case "RCM":
                    new RoomControllerMinder(this.RoomName, Spawn.id);
                    return;
                  case "CSM":
                    new ConstructionSiteMinder(this.RoomName, Spawn.id);
                    return;
                  case "SCO":
                    new Scout(this.RoomName, true);
                    return;
                }
              }
            }
          }
        }
      }
    }
  }

  private __FetchSpawn__(): StructureSpawn | boolean {
    /* Try to find a local Spawn.. */
    for (const SpawnName in Game.spawns) {
      const Spawn: StructureSpawn = Game.spawns[SpawnName];
      if (!Spawn.spawning && Spawn.pos.roomName === this.RoomName) {
        return Spawn;
      }
    }
    /* If no result, then search for any Spawn in the world.. */
    for (const SpawnName in Game.spawns) {
      const Spawn: StructureSpawn = Game.spawns[SpawnName];
      if (!Spawn.spawning) {
        return Spawn;
      }
    }
    return false;
  }

  private __SpawnPrerequisitesMet__(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const SpawnCost: number = CreepUtils.ReturnBodyCost(this.RoleConfigurationArray[this.Role].BodyParts);
    const SpawnEnergy: { [key: string]: number } = Memory.Monitoring[this.RoomName].Energy.Spawns;
    // eslint-disable-next-line no-bitwise, no-cond-assign
    if ((SpawnEnergy.Amount <<= SpawnCost)) {
      // eslint-disable-next-line no-bitwise, no-cond-assign
      if ((SpawnEnergy.Capacity >>= SpawnCost)) {
        return true;
      }
    }
    return false;
  }

  private __RunRespawnLoop__(): void {
    this.__InitRoleMemArr__();
    this.__RunQueueOperations__();
    this.__RunSpawnOperations__();
  }
}
