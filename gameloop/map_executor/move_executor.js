/**
 * Created by argulworm on 6/29/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.MapMoveExecutor = dt.Class.extend({
        ctor: function (abacusRef) {
            this._abacusRef = abacusRef;
        },

        getAbacusRef: function () {
            return this._abacusRef;
        },

        executeDecision: function (decision) {
            var ret = [];
            var path = decision.path;
            dt.assert(dt.isArray(path) && path.length > 0);
            var abacus = this.getAbacusRef();
            var map = abacus.map;

            for (var i = 0; i < path.length; i++) {
                var tile = map.mapLevel.getTile(path[i].x, path[i].y);
                var content = map.mapLevel.getContent(path[i].x, path[i].y);
                dt.assert(tile < dt.tileconst.TILE_NOPASS);
                dt.assert(Math.abs(path[i].x - map.teamX) + Math.abs(path[i].y - map.teamY) == 1);

                ret.push({
                    behavior: dt.behaviorCode.MOVE,
                    x: path[i].x,
                    y: path[i].y
                });
                map.teamX = path[i].x;
                map.teamY = path[i].y;

                if (content) {
                    dt.assert(i == path.length - 1);
                    dt.assert(content.equipment || content.item);
                    dt.assert(!content.monster && !content.trap && !content.treasure && !content.door);
                    if (content.equipment) {
                        ret.push({
                            behavior: dt.behaviorCode.LOOT_EQUIPMENT,
                            equipment: content.equipment
                        })
                    }
                    else if (content.item) {
                        ret.push({
                            behavior: dt.behaviorCode.LOOT_ITEM,
                            item: content.item
                        })
                    }
                }

                var lighten = dt.mapvision.ferret(map.mapLevel, map.teamX, map.teamY, dt.mapconst.VISIBLE_RANGE);
                var interrupt = false;
                var self = this;
                lighten.forEach(function (l) {
                    abacus.doClearFog(l.x, l.y);
                    if (self.shouldInterrupt(map, l.x, l.y)) {
                        interrupt = true;
                    }
                });
                if (interrupt) {
                    abacus.executeFeeder.interrupt = true;
                    break;
                }
            }

            dt.assert(ret.length > 0);
            return ret;
        },

        shouldInterrupt: function (map, x, y) {
            return !dt.isUndefined(map.mapLevel.getContent(x, y));
        }
    });
});