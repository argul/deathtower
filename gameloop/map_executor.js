/**
 * Created by argulworm on 6/29/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.MapExecutor = dt.Class.extend({
        ctor: function (abacusRef) {
            this._abacusRef = abacusRef;
        },

        getAbacusRef: function () {
            return this._abacusRef;
        },

        execute: function (decision) {
            switch (decision.aicode) {
                case dt.mapAIDecisionCode.MOVE:
                    this._executeMove(decision.moveToX, decision.moveToY);
                    break;
                default:
                    dt.assert(false);
            }
        },

        _executeMove: function (moveToX, moveToY) {
            var ret = [];
            if (dt.debug.isStrict()) {
                this._checkMove(moveToX, moveToY)
            }
            this.getAbacusRef().playerStat.posX = moveToX;
            this.getAbacusRef().playerStat.posY = moveToY;
            ret.push({
                behaviorCode: dt.behaviorCode.MOVE,
                x: moveToX,
                y: moveToY
            });
            var tile = this.getAbacusRef().mapStat.mapLevel.getTile(moveToX, moveToY);
            if (tile > dt.mapconst.TILE_START_LOOT && tile < dt.mapconst.TILE_END_LOOT) {
                ret.push({
                    behaviorCode: dt.behaviorCode.LOOT_MINOR,
                    loot: this.getAbacusRef().mapStat.loots[moveToX * 10000 + moveToY]
                });
            }
            return ret;
        },

        _checkMove: function (moveToX, moveToY) {
            var tx = Math.abs(moveToX - this.getAbacusRef().playerStat.posX);
            var ty = Math.abs(moveToY - this.getAbacusRef().playerStat.posY);
            dt.assert(1 == (tx + ty));
            dt.assert(dt.mapconst.TILE_PASS > this.getAbacusRef().mapStat.mapLevel.getTile(moveToX, moveToY));
        }
    });
});