export interface ResourceDroppedEnergyInterface {
  [key: Id<Resource<RESOURCE_ENERGY>>]: {
    Position: RoomPosition;
    Amount: number;
  };
}
