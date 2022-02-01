export class UUID {
  private constructor() {
    //
  }
  public static generateUUID(Prefix?: string): Uppercase<string> {
    if (Prefix) {
      const UUIDString: Uppercase<string> = Prefix.toUpperCase() + Game.time.toString(16).toUpperCase();
      return UUIDString;
    } else {
      const UUIDString: Uppercase<string> = Game.time.toString(16).toUpperCase();
      return UUIDString;
    }
  }
}
