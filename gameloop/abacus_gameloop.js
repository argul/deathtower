/**
 * Created by argulworm on 6/29/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.AbacusGameloop = dt.Class.extend({
        MODE_MAP: 'MODE_MAP',
        MODE_BATTLE: 'MODE_BATTLE',
        ctor: function (paramsPack) {
            this.abacusId = paramsPack.abacusId;
            this.ctx = new dt.Context(paramsPack.seed);
            this.behaviors = [];
            this.config = {};
            this.map = {};
            this.battle = {};
            this.teamData = new dt.TeamData(paramsPack.teamEnterData);
            this.customized = paramsPack.customized;

            this.config.mapConfig = paramsPack.mapConfig;
            this.config.maxLevel = paramsPack.maxLevel;

            this.map.curLevel = 1;
            var mapLevel = dt.mapgen.generateMapLevel(paramsPack.mapConfig, this.ctx);
            this.map.mapLevel = mapLevel;
            var stairs = dt.mapassemble.makeStairs(mapLevel, this.ctx);
            this.map.upstair = stairs.up;
            this.map.downstair = stairs.down;
            this.map.visibleListX = [];
            this.map.visibleListY = [];

            this.mapAI = new dt.MapAI(this);
            this.mapExecutor = new dt.MapExecutor(this);

            this.behaviors.push({
                behaviorCode: dt.behaviorCode.ENTER_TOWER
            });

            this.behaviors.push({
                behaviorCode: dt.behaviorCode.ENTER_MAP,
                x: stairs.down.x,
                y: stairs.down.y,
                mapLevel: mapLevel
            });

            var self = this;
            var lighten = dt.mapvision.ferret(mapLevel, stairs.down.x, stairs.down.y, 3);
            if (lighten.length > 0) {
                var b = {
                    behaviorCode: dt.behaviorCode.UPDATE_MAP,
                    fogs: []
                };
                lighten.forEach(function (xy) {
                    mapLevel.clearFog(xy.x, xy.y);
                    b.fogs.push(xy);
                    self.visibleListX.push(xy.x);
                    self.visibleListY.push(xy.y);
                });
                this.behaviors.push(b);
            }
        },

        tick: function () {
            var self = this;
            while (this.behaviors.length <= 0) {
                var decisions = this.mapAI.tick();
                for (var i = 0; i < decisions.length; i++) {
                    var result = self.mapExecutor.execute(decisions[i]);
                    self.behaviors = self.behaviors.concat(result);
                }
            }
            dt.assert(this.behaviors.length > 0);
            return this.behaviors.shift();
        }
    });
});
