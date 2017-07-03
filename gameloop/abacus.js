/**
 * Created by argulworm on 6/29/17.
 */

dt.behaviorCode = {
    IDLE: 0,
    MOVE: 1,
    LOOT_MINOR: 2,
    LOOT_TREASURE: 3
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
                loots: [],//todo [dt.MapLoot]
                monsters: [],//todo [dt.MapMonster]
                traps: []//todo [dt.MapTrap]
            };
            this.playerStat = {
                teamData: undefined,//todo
                posX: stairs.down.x,
                posY: stairs.down.y
            };
            this.mapAI = new dt.MapAI(this);
            this.mapExecutor = new dt.MapExecutor(this);
            this.battleExecutor = new dt.BattleExecutor(this);

            this.curAI = this.mapAI;
            this.curExecutor = this.mapExecutor;
        },

        getRandom: function () {
            return this.ctx.random;
        },

        tick: function () {
            var self = this;
            if (this.behaviors.length <= 0) {
                var decisions = this.curAI.tick();
                decisions.forEach(function (x) {
                    self._willExecuteDecision(x);
                    self.behaviors.concat(self.curExecutor.execute(x));
                    self._didExecuteDecision(x);
                });
            }
            dt.debug.assert(this.behaviors.length > 0);
            return this.behaviors.shift();
        },

        _willExecuteDecision: function (decision) {

        },

        _didExecuteDecision: function (decision) {

        }
    });
});
