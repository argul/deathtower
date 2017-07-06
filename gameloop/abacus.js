/**
 * Created by argulworm on 6/29/17.
 */

dt.behaviorCode = {
    DEFEATED: 'DEFEATED',
    ENTER_MAP: 'ENTER_MAP',
    LEAVE_MAP: 'LEAVE_MAP',
    MOVE: 'MOVE',
    HESITATE_POSITIVE: 'HESITATE_POSITIVE',
    HESITATE_NEGATIVE: 'HESITATE_NEGATIVE',
    LOOT_EQUIPMENT: 'LOOT_EQUIPMENT',
    LOOT_ITEM: 'LOOT_ITEM',
    OPEN_TREASURE_BOX: 'OPEN_TREASURE_BOX',
    ANIM_TREASURE_BOX_CONTENT: 'ANIM_TREASURE_BOX_CONTENT',
    GET_TREASURE_LOOTS: 'GET_TREASURE_LOOTS',


    UPDATE_MAP: 'UPDATE_MAP',
};

dt.registerClassInheritance('dt.Class', function () {
    dt.Abacus = dt.Class.extend({
        ctor: function (paramsPack) {
            this.abacusId = paramsPack.abacusId;
            this.behaviors = [];
            this.config = {};
            this.config.mapConfig = paramsPack.mapConfig;
            this.config.maxLevel = paramsPack.maxLevel;

            this.ctx = new dt.Context(paramsPack.seed);
            var mapLevel = dt.mapgen.generateMapLevel(paramsPack.mapConfig, this.ctx);
            var stairs = dt.mapassemble.makeStairs(mapLevel, this.ctx);

            this.mapStat = {
                levelNum: 1,
                mapLevel: mapLevel,
                upstair: stairs.up,
                downstair: stairs.down,
                loots: {},//todo { posXY: dt.MapLoot }
                monsters: {},//todo { posXY: dt.MapMonster }
                traps: {},//todo { posXY: dt.MapTrap }
                treasures: {}//todo { posXY: dt.MapTreasure }
            };
            this.playerStat = {
                teamData: undefined,//todo
                posX: stairs.down.x,
                posY: stairs.down.y
            };
            this.battleStat = {};
            this.mapAI = new dt.MapAI(this);
            this.battleAI = undefined;
            this.mapExecutor = new dt.MapExecutor(this);
            this.battleExecutor = new dt.BattleExecutor(this);

            this.curAI = this.mapAI;
            this.curExecutor = this.mapExecutor;

            var unvisitedRooms = {};
            this.mapStat.mapLevel.getRoomArr().forEach(function (x) {
                unvisitedRooms[x.roomId] = x;
            });
            this.mapStat.unvisitedRooms = unvisitedRooms;

            this.behaviors.push({
                behaviorCode: dt.behaviorCode.ENTER_MAP,
                x: stairs.down.x,
                y: stairs.down.y,
                tiles: mapLevel.tiles
            });
        },

        getRandom: function () {
            return this.ctx.random;
        },

        tick: function () {
            var self = this;
            while (this.behaviors.length <= 0) {
                var decisions = this.curAI.tick();
                for (var i = 0; i < decisions.length; i++) {
                    var result = self.curExecutor.execute(decisions[i]);
                    self.behaviors = self.behaviors.concat(result.behaviors);
                    if (result.map2battle) {
                        this.curAI = this.battleAI;
                        this.curExecutor = this.battleExecutor;
                    }
                    else if (result.battle2map) {
                        this.curAI = this.mapAI;
                        this.curExecutor = this.mapExecutor;
                    }
                    if (result.interrupt) {
                        break;
                    }
                }
            }
            dt.assert(this.behaviors.length > 0);
            return this.behaviors.shift();
        },

        RAID_MONSTER_DIRECT: 0,
        RAID_MONSTER_AFTER_HESITATE: 1,
        FLEE_FROM_MONSTER: 2,
        decideRaidMonster: function (monster) {
            var riskLevel = this.calculateMonsterRiskLevel(this.playerStat.teamData, monster);
            if (riskLevel <= dt.monsterRelativeDangerLevel.EASY) {
                return [dt.mapAIDecisionCode.RAID_MONSTER];
            }
            else {
                switch (this._strategy) {
                    case dt.mapAIStrategy.FULL_AGGRESIVE:
                        return this.RAID_MONSTER_DIRECT;
                    case dt.mapAIStrategy.MEDIUM_AGGRESIVE:
                        return this._doCoreCalculate_Monster(0.75, riskLevel) ? this.RAID_MONSTER_AFTER_HESITATE : this.FLEE_FROM_MONSTER;
                    case dt.mapAIStrategy.NORMAL:
                        return this._doCoreCalculate_Monster(0.5, riskLevel) ? this.RAID_MONSTER_AFTER_HESITATE : this.FLEE_FROM_MONSTER;
                    case dt.mapAIStrategy.MEDIUM_COWARD:
                        return this._doCoreCalculate_Monster(0.25, riskLevel) ? this.RAID_MONSTER_AFTER_HESITATE : this.FLEE_FROM_MONSTER;
                    case dt.mapAIStrategy.FULL_COWARD:
                        return this.FLEE_FROM_MONSTER;
                    default:
                        dt.assert(false);
                }
            }
        },

        _doCoreCalculate_Monster: function (p, riskLevel) {
            //todo
            return true;
        },

        _doCoreCalculate_Trap: function (p) {
            //todo
            return true;
        },

        calculateMonsterRiskLevel: function (teamData, monster) {
            //todo
            return dt.monsterRelativeDangerLevel.NORMAL;
        },

        TREAD_TRAP_DIRECT: 0,
        TREAD_TRAP_AFTER_HESITATE: 1,
        FLEE_FROM_TRAP: 2,
        decideTreadoverTrap: function () {
            switch (this._strategy) {
                case dt.mapAIStrategy.FULL_AGGRESIVE:
                    return this.TREAD_TRAP_DIRECT;
                case dt.mapAIStrategy.MEDIUM_AGGRESIVE:
                    return this._doCoreCalculate_Monster(0.75) ? this.TREAD_TRAP_AFTER_HESITATE : this.FLEE_FROM_TRAP;
                case dt.mapAIStrategy.NORMAL:
                    return this._doCoreCalculate_Monster(0.5) ? this.TREAD_TRAP_AFTER_HESITATE : this.FLEE_FROM_TRAP;
                case dt.mapAIStrategy.MEDIUM_COWARD:
                    return this._doCoreCalculate_Monster(0.25) ? this.TREAD_TRAP_AFTER_HESITATE : this.FLEE_FROM_TRAP;
                case dt.mapAIStrategy.FULL_COWARD:
                    return this.FLEE_FROM_TRAP;
                default:
                    dt.assert(false);
            }
        }
    });
});
