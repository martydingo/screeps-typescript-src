export interface ConstructionSitesInterface {
  [key: Uppercase<string>]: {
    [key: Id<ConstructionSite>]: {
      Progress: number;
      ProgressTotal: number;
      ProgressPercentage: string;
    };
  };
}
