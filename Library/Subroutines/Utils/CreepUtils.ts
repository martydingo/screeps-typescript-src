/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/ban-types */
import { ConstructionSiteMinder } from "Library/Creeps/Minders/ConstructionSiteMinder";
import { GlobalConstants } from "Configuration/Global/Constants";
import { RoomControllerMinder } from "Library/Creeps/Minders/RoomControllerMinder";
import { SourceMinder } from "Library/Creeps/Minders/SourceMinder";
import { SpawnMinder } from "Library/Creeps/Minders/SpawnMinder";

export class CreepUtils {
  public static ReturnClassForRole(Role: Uppercase<string>): Function {
    const RoleFunctions: { [functionName: string]: Function } = {
      //   SCO: Scout.,
      SOM: SourceMinder,
      SPM: SpawnMinder,
      RCM: RoomControllerMinder,
      CSM: ConstructionSiteMinder
    };
    return RoleFunctions[Role];
  }
  public static ReturnBodyCost(CreepBodyParts: BodyPartConstant[]): number {
    const BodyPartCosts: any = GlobalConstants.BodyPartCosts;
    let TotalCost = 0;
    // eslint-disable-next-line @typescript-eslint/no-for-in-array
    for (const BodyPart in CreepBodyParts) {
      const BodyPartName: Uppercase<string> = CreepBodyParts[BodyPart].toString().toUpperCase();
      const BodyPartCost: number = BodyPartCosts[BodyPartName];
      TotalCost = TotalCost + BodyPartCost;
    }
    return TotalCost;
  }
}
