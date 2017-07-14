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
            this.config.visRange = paramsPack.visRange;

            this.map.curLevel = 1;
            var mapLevel = dt.mapgen.generateMapLevel(paramsPack.mapConfig, this.ctx);
            this.map.mapLevel = mapLevel;
            var stairs = dt.mapassemble.makeStairs(mapLevel, this.ctx);
            this.map.upstair = stairs.up;
            this.map.downstair = stairs.down;
            this.map.teamX = stairs.down.x;
            this.map.teamY = stairs.down.y;

            this.mapAI = new dt.MapAI(this);
            this.aiFeeder = {
                visibleLoots: {},
                visibleMonsters: {},
                visibleTreasures: {},
                visibleTraps: {},
                visibleDoors: {}
            };
            this.executeFeeder = {
                interrupt: false
            };

            this.mapExecutors = {};
            // todo
            this.mapExecutors[dt.mapAICode.MOVE] = new dt.MapMoveExecutor(this);
            this.mapExecutors[dt.mapAICode.GO_UPSTAIR] = new dt.MapGoUpstairExecutor(this);

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
            var lighten = dt.mapvision.ferret(mapLevel, stairs.down.x, stairs.down.y, this.config.visRange);
            if (lighten.length > 0) {
                var b = {
                    behavior: dt.behaviorCode.UPDATE_MAP,
                    fogs: []
                };
                lighten.forEach(function (xy) {
                    self.doClearFog(xy.x, xy.y);
                    b.fogs.push(xy);
                });
                this.behaviors.push(b);
            }
        },

        tick: function () {
            while (this.behaviors.length <= 0) {
                var decisions = this.mapAI.makeDecision();
                for (var i = 0; i < decisions.length; i++) {
                    var executor = this.mapExecutors[decisions[i].aicode];
                    var bvs = executor.executeDecision(decisions[i]);
                    dt.print('<=========================================>');
                    dt.print(bvs);
                    this.behaviors = this.behaviors.concat(bvs);

                    if (this.executeFeeder.interrupt) {
                        this.executeFeeder.interrupt = false;
                        break;
                    }
                }
            }
            dt.assert(this.behaviors.length > 0);
            var ret = this.behaviors.shift();
            this._postProcess(ret);

            return ret;
        },

        doClearFog: function (x, y) {
            this.map.mapLevel.clearFog(x, y);
            var content = this.map.mapLevel.getContent(x, y);
            if (dt.isUndefined(content)) {
                return;
            }
            if (content.equipment) {
                this.aiFeeder.visibleLoots[x * 10000 + y] = content.equipment;
            }
            if (content.item) {
                this.aiFeeder.visibleLoots[x * 10000 + y] = content.item;
            }
            if (content.monster) {
                this.aiFeeder.visibleMonsters[x * 10000 + y] = content.monster;
            }
            if (content.treasure) {
                this.aiFeeder.visibleTreasures[x * 10000 + y] = content.treasure;
            }
            if (content.trap) {
                this.aiFeeder.visibleTraps[x * 10000 + y] = content.trap;
            }
            if (content.door) {
                this.aiFeeder.visibleDoors[x * 10000 + y] = content.door;
            }
        },

        _postProcess: function (b) {
            if (b.behavior == dt.behaviorCode.LEAVE_MAP) {
                if (this.map.curLevel == this.config.maxLevel) {
                    this.behaviors.push({
                        behavior: dt.behaviorCode.LEAVE_TOWER
                    });
                }
                else {
                    this._generateNewMapLevel();
                }
            }
        },

        _generateNewMapLevel: function () {
            // todo
        }
    });
});
