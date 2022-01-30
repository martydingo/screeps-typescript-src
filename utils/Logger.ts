enum SeverityLevel {
  Emergency = "Emergency",
  Alert = "Alert",
  Critical = "Critical",
  Error = "Error",
  Warning = "Warning",
  Notice = "Notice",
  Informational = "Informational",
  Debug = "Debug"
}

export interface Severity {
  [SeverityLevel.Emergency]: string;
  [SeverityLevel.Alert]: string;
  [SeverityLevel.Critical]: string;
  [SeverityLevel.Error]: string;
  [SeverityLevel.Warning]: string;
  [SeverityLevel.Notice]: string;
  [SeverityLevel.Informational]: string;
  [SeverityLevel.Debug]: string;
}

export class Logger {
  public static Severity: Record<SeverityLevel, Severity>;
  public constructor() {
    Logger.Severity = {
      Emergency: '<font color="#ff0000">',
      Alert: '<font color="#c00000">',
      Critical: '<font color="#c00000">',
      Error: '<font color="#cc5500">',
      Warning: '<font color="#eeaa00">',
      Notice: '<font color="#eeff00">',
      Informational: '<font color="#aaaaaa">',
      Debug: '<font color="#666666">'
    };
  }
  public static log(DesiredSeverity: SeverityLevel, message: string): void {
    console.log(Logger.Severity[DesiredSeverity] + "" + message);
  }
}
