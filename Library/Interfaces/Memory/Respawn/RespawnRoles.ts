import { CSMRespawnRoleConfiguration } from "./RespawnRoles/CSMRespawnRoleConfiguration";
import { RCMRespawnRoleConfiguration } from "./RespawnRoles/RCMRespawnRoleConfiguration";
import { SCORespawnRoleConfiguration } from "./RespawnRoles/SCORespawnRoleConfiguration";
import { SOMRespawnRoleConfiguration } from "./RespawnRoles/SOMRespawnRoleConfiguration";
import { SPMRespawnRoleConfiguration } from "./RespawnRoles/SPMRespawnRoleConfiguration";

export interface RespawnRoles {
  SOM: SOMRespawnRoleConfiguration;
  SPM: SPMRespawnRoleConfiguration;
  RCM: RCMRespawnRoleConfiguration;
  SCO: SCORespawnRoleConfiguration;
  CSM: CSMRespawnRoleConfiguration;
}
