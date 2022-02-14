import { Base64 } from "./Base64";

export class UUID {
  private constructor() {
    //
  }
  public static generateUUID(Prefix?: string): Uppercase<string> {
    if (Prefix) {
      const UUIDString: Uppercase<string> = Prefix.toUpperCase() + "-" + Base64.encode(Game.time.toString());
      return UUIDString;
    } else {
      const UUIDString: Uppercase<string> = Base64.encode(Game.time.toString());
      return UUIDString;
    }
  }
}
