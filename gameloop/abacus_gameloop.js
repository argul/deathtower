/**
 * Created by argulworm on 6/29/17.
 */

dt.registerClassInheritance('dt.Cls', function () {
    dt.AbacusGameloop = dt.Cls.extend({
        _VERBOSE: false,
        MODE_MAP: 'MODE_MAP',
        MODE_BATTLE: 'MODE_BATTLE',
        ctor: function (paramsPack) {
            this.abacusId = paramsPack.abacusId;
            this.rnd = new dt.Random(paramsPack.seed);
            this.behaviors = [{
                behaviorCode: dt.behaviorCode.ENTER_TOWER
            }];

            this.config = {};
            this.config.mapConfig = paramsPack.mapConfig;
            this.config.maxLevel = paramsPack.maxLevel;
            this.config.visRange = paramsPack.visRange;

            this.teamData = new dt.TeamData(paramsPack.teamEnterData);
            this.customized = paramsPack.customized;

            this.battle = {};

            this._enterNewMapLevel(1);
        },

        tick: function () {
            while (this.behaviors.length <= 0) {
                if (this._VERBOSE) {
                    var self = this;
                    dt.debug.dumpAscIIMap(this.map.mapLevel, function (x, y) {
                        if (x == self.map.teamX && y == self.map.teamY) {
                            return 'X';
                        }
                    });
                }

                var decisions = this.mapAI.makeDecision();
                for (var i = 0; i < decisions.length; i++) {
                    var executor = this.mapExecutors[decisions[i].aicode];
                    var bvs = executor.executeDecision(decisions[i]);
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
                    this._enterNewMapLevel(this.map.curLevel + 1);
                }
            }
        },

        _enterNewMapLevel: function (level) {
            this.map = {};
            this.map.curLevel = level;
            var mapLevel = dt.mapgen.generateMapLevel(this.config.mapConfig, this.rnd);
            this.map.mapLevel = mapLevel;
            var stairs = dt.mapassemble.makeStairs(mapLevel, this.rnd);
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
                behaviorCode: dt.behaviorCode.ENTER_MAP,
                x: stairs.down.x,
                y: stairs.down.y,
                mapLevel: mapLevel
            });

            var self = this;
            var lighten = dt.mapvision.ferret(mapLevel, this.map.teamX, this.map.teamY, this.config.visRange);
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
        }
    });
});
