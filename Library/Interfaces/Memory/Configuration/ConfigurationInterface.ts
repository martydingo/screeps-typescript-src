import { CreepConfiurationInterface } from "./CreepConfigurationInterface";

export interface ConfigurationInterface {
  [key: Uppercase<string>]: {
    Creeps: CreepConfiurationInterface;
  };
}
