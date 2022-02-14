import { CSMCreepConfigurationInterface } from "./Creeps/CSMCreepConfigurationInterface";
import { RCMCreepConfigurationInterface } from "./Creeps/RCMCreepConfigurationInterface";
import { SCOCreepConfigurationInterface } from "./Creeps/SCOCreepConfigurationInterface";
import { SOMCreepConfigurationInterface } from "./Creeps/SOMCreepConfigurationInterface";
import { SPMCreepConfigurationInterface } from "./Creeps/SPMCreepConfigurationInterface";

export interface CreepConfiurationInterface {
  [key: string]: any;
  SOM: SOMCreepConfigurationInterface;
  RCM: RCMCreepConfigurationInterface;
  SCO: SCOCreepConfigurationInterface;
  SPM: SPMCreepConfigurationInterface;
  CSM: CSMCreepConfigurationInterface;
}
