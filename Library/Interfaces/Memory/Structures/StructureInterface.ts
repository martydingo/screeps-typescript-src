import { ExtensionInterface } from "./ExtensionInterface";
import { SpawnerInterface } from "./SpawnerInterface";

export interface StructureInterface {
  [key: Uppercase<string>]: {
    Extensions: ExtensionInterface;
    Spawners: SpawnerInterface;
  };
}
