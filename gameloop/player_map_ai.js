/**
 * Created by argulworm on 6/29/17.
 */

dt.mapAICode = {
    IDLE: 0,
    MOVE: 1

};

dt.registerClassInheritance('dt.Class', function () {
    dt.PlayerMapAI = dt.Class.extend({
        DECISION_EXPLORE_ROOM: 'DECISION_EXPLORE_ROOM',
        DECISION_GOTO_ROOM: 'DECISION_GOTO_ROOM',
        DECISION_GOTO_TREASURE: 'DECISION_GOTO_TREASURE',
        DECISION_GOTO_MONSTER: 'DECISION_GOTO_MONSTER',
        ctor: function (abacusRef, strategy) {
            this._abacusRef = abacusRef;
            this._strategy = strategy;
            this._curDecision = undefined;
            this._curRoom = undefined;
        },

        getAbacusRef: function () {
            return this._abacusRef;
        },

        getStrategy: function () {
            return this._strategy;
        },

        reset: function () {
            var abacus = this.getAbacusRef();
            var x = abacus.playerStat.posX;
            var y = abacus.playerStat.posY;
            var mapLevel = abacus.mapStat.mapLevel;
            if (mapLevel.getTile(x, y) == dt.mapconst.TILE_ROOMFLOOR) {
                this._curRoom = mapLevel.getRoomByTile(x, y);
                this._curDecision = this.DECISION_EXPLORE_ROOM;
            }
            else {

            }
        },

        tick: function () {

        }
    });
});