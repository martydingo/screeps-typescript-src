export interface ExtensionInterface {
  [key: Id<StructureExtension>]: {
    Energy: {
      Amount: number;
      Capacity: number;
    };
  };
}
