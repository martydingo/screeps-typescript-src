export interface SOMRespawnRoleConfiguration {
  [key: Id<Source>]: {
    AssignedCreep: Id<Creep> | null;
  };
}
