export interface RespawnQueue {
  [key: string]: RespawnQueueEntry | null;
}

export interface RespawnQueueEntry {
  Role: Uppercase<string>;
  Room: Uppercase<string>;
  AssignedID?: Id<Source> | Id<StructureSpawn>;
  ClaimMode?: boolean;
  Priority: number;
  CreationTime: number;
}
