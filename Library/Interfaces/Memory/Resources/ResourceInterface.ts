import { ResourceDroppedEnergyInterface } from "./Library/Energy/DroppedEnergyInterface";
import { ResourceEnergySourceInterface } from "./Library/Energy/SourcesInterface";

export interface ResourceInterface {
  [Energy: string]: {
    Dropped: ResourceDroppedEnergyInterface;
    Sources: ResourceEnergySourceInterface;
  };
}
