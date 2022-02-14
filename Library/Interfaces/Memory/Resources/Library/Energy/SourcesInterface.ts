export interface ResourceEnergySourceInterface {
  [key: Id<Source>]: {
    Energy?: number;
    Capacity?: number;
  };
}
