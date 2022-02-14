export const PathfinderOptions = {
  Default: {
    plainCost: 2,
    swampCost: 10,
    heuristicWeight: 1.5,

    roomCallback(roomName: Uppercase<string>): CostMatrix | boolean {
      const room = Game.rooms[roomName];
      /* 
      In this example `room` will always exist, but since
      PathFinder supports searches which span multiple rooms
      you should be careful! 
      */
      if (!room) return false;
      const costs = new PathFinder.CostMatrix();

      room.find(FIND_STRUCTURES).forEach(function (struct) {
        if (struct.structureType === STRUCTURE_ROAD) {
          /* Favor roads over plain tiles */
          costs.set(struct.pos.x, struct.pos.y, 1);
        } else if (
          struct.structureType !== STRUCTURE_CONTAINER &&
          (struct.structureType !== STRUCTURE_RAMPART || !struct.my)
        ) {
          /* Avoid walk through non-walkable buildings */
          costs.set(struct.pos.x, struct.pos.y, 255);
        }
      });

      // Avoid creeps in the room
      room.find(FIND_CREEPS).forEach(function (creep) {
        costs.set(creep.pos.x, creep.pos.y, 20);
      });

      return costs;
    }
  }
};
