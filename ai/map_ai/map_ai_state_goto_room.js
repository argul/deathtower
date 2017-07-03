/**
 * Created by argulworm on 6/30/17.
 */

dt.registerClassInheritance('dt.AIStateInterface', function () {
    dt.MapAIStateGotoRoom = dt.AIStateInterface.extend({
        ctor: function (aiRef) {
            this.aiRef = aiRef;
        },

        getStateName: function () {
            return 'MapAIStateGotoRoom';
        },

        tick: function () {
            var ret = undefined;
            var path = this.aiRef._curPath;
            var next = path.shift();
            if (this.aiRef.getMapLevel().getTile(next.x, next.y) == dt.mapconst.TILE_MONSTER) {
                ret = this._onEncounterMonster(next);
            }
            else if (this.aiRef.getMapLevel().getTile(next.x, next.y) == dt.mapconst.TILE_TRAP) {
                ret = [{
                    aicode: dt.mapAIDecisionCode.DISARM_TRAP,
                    x: next.x,
                    y: next.y
                }];
            }
            else if (this.aiRef.getMapLevel().getTile(next.x, next.y) == dt.mapconst.TILE_TRAP_PERSISTENT) {
                ret = this._onEncounterHardTrap(next);
            }
            else {
                ret = [{
                    aicode: dt.mapAIDecisionCode.MOVE,
                    moveToX: next.x,
                    moveToY: next.y
                }];
            }

            if (path.length <= 0) {
                this.markAsDone();
            }

            return ret;
        },

        _onEncounterMonster: function (next) {
            var monster = this.aiRef.getAbacusRef().mapStat.monsters[next.x * 10000 + next.y];
            var result = this.aiRef.decideRaidMonster(monster);
            if (result == 0) {
                return [{
                    aicode: dt.mapAIDecisionCode.RAID_MONSTER,
                    x: next.x,
                    y: next.y
                }];
            }
            else if (result == 1) {
                return [{
                    aicode: dt.mapAIDecisionCode.HESITATE
                }, {
                    aicode: dt.mapAIDecisionCode.RAID_MONSTER,
                    x: next.x,
                    y: next.y
                }];
            }
            else if (result == 2) {
                this.markAsDone();
                return [{
                    aicode: dt.mapAIDecisionCode.HESITATE
                }, {
                    aicode: dt.mapAIDecisionCode.EVADE_MONSTER,
                    x: next.x,
                    y: next.y
                }];

            }
            else {
                dt.debug.assert(false);
            }
        },

        _onEncounterHardTrap: function (next) {
            var result = this.aiRef.decideTreadoverTrap();
            if (result == 0) {
                return [{
                    aicode: dt.mapAIDecisionCode.TREAD_TRAP,
                    x: next.x,
                    y: next.y
                }];
            }
            else if (result == 1) {
                return [{
                    aicode: dt.mapAIDecisionCode.HESITATE
                }, {
                    aicode: dt.mapAIDecisionCode.TREAD_TRAP,
                    x: next.x,
                    y: next.y
                }];
            }
            else if (result == 2) {
                this.markAsDone();
                return [{
                    aicode: dt.mapAIDecisionCode.HESITATE
                }, {
                    aicode: dt.mapAIDecisionCode.EVADE_TRAP,
                    x: next.x,
                    y: next.y
                }];

            }
            else {
                dt.debug.assert(false);
            }
        }
    });
});