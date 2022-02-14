import { ConfigurationInterface } from "Library/Interfaces/Memory/Configuration/ConfigurationInterface";

export const RoomCreepConfiguration: ConfigurationInterface = {
  Global: {
    Creeps: {
      SOM: {
        BodyParts: [WORK, MOVE, CARRY],
        Priority: 1
      },
      RCM: {
        BodyParts: [WORK, WORK, MOVE, CARRY],
        Priority: 4,
        ClaimMode: false
      },
      SCO: {
        BodyParts: [MOVE],
        Priority: 3
      },
      SPM: {
        BodyParts: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE],
        DesiredCreepCount: 1,
        Priority: 2
      },
      CSM: {
        BodyParts: [WORK, MOVE, CARRY],
        Priority: 5
      }
    }
  },
  W1N4: {
    Creeps: {
      SOM: {
        BodyParts: [WORK, MOVE, CARRY],
        Priority: 1
      },
      RCM: {
        BodyParts: [WORK, WORK, MOVE, CARRY],
        Priority: 4,
        ClaimMode: false
      },
      SCO: {
        BodyParts: [MOVE],
        Priority: 3
      },
      SPM: {
        BodyParts: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE],
        DesiredCreepCount: 1,
        Priority: 2
      },
      CSM: {
        BodyParts: [WORK, MOVE, CARRY],
        Priority: 5
      }
    }
  },
  W2N5: {
    Creeps: {
      SOM: {
        BodyParts: [WORK, MOVE, CARRY],
        Priority: 1
      },
      RCM: {
        BodyParts: [WORK, WORK, MOVE, CARRY],
        Priority: 2,
        ClaimMode: true
      },
      SCO: {
        BodyParts: [MOVE],
        Priority: 4
      },
      SPM: {
        BodyParts: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE],
        DesiredCreepCount: 1,
        Priority: 3
      },
      CSM: {
        BodyParts: [WORK, MOVE, CARRY],
        Priority: 5
      }
    }
  }
};
