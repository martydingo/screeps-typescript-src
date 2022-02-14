import { GlobalConstants } from "Configuration/Global/Constants";
export class Log {
  private constructor() {
    //
  }
  public static Emergency(Message: string): void {
    console.log('<font color="#ff0000">Emergency| ' + Message);
  }
  public static Alert(Message: string): void {
    console.log('<font color="#c00000">Alert|' + Message);
  }
  public static Critical(Message: string): void {
    console.log('<font color="#c00000">Critical|' + Message);
  }
  public static Error(Message: string): void {
    console.log('<font color="#cc5500">Error|' + Message);
  }
  public static Warning(Message: string): void {
    console.log('<font color="#eeaa00">Warning|' + Message);
  }
  public static Notice(Message: string): void {
    console.log('<font color="#eeff00">Notice|' + Message);
  }
  public static Informational(Message: string): void {
    console.log('<font color="#666666">Informational|' + Message);
  }
  public static Debug(Message: string): void {
    if (GlobalConstants.Logging.Debug === true) {
      console.log('<font color="#666666">Debug|' + Message);
    }
  }
}
