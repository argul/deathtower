/**
 * Created by argulworm on 7/17/17.
 */

dt.registerClassInheritance('dt.Cls', function () {
    dt.Battleground = dt.Cls.extend({
        ctor: function (teamdata, monsterdata) {
            this.rightUnits = {};
            this.leftUnits = {};
            var self = this;
            teamdata.forEach(function (x, idx) {
                self._initTeamUnit(x, idx + 1);
            });
            monsterdata.forEach(function (x, idx) {
                self._initMonsterUnit(x, idx + 1);
            });
        },

        _initTeamUnit: function (udata, position) {
            var u = new dt.BattleUnit(position, position, true, udata);
            this.rightUnits[position] = u;
        },

        _initMonsterUnit: function (udata, position) {
            var u = new dt.BattleUnit(position, position, false, udata);
            this.leftUnits[position] = u;
        },

        getAllUnits: function () {
            var arr1 = dt.suger.getValues(this.leftUnits);
            var arr2 = dt.suger.getValues(this.rightUnits);
            return arr1.concat(arr2);
        },

        _getUnitsByPositions: function (positions) {
            var ret = [];
            for (var i = 0; i < positions.length; i++) {
                if (dt.isUndefined(this.leftUnits[positions[i]])) {
                    ret.push(this.leftUnits[positions[i]]);
                }
                else if (dt.isUndefined(this.rightUnits[positions[i]])) {
                    ret.push(this.rightUnits[positions[i]]);
                }
            }
            return ret;
        },

        _getUnitByPosition: function (pos) {
            if (dt.isUndefined(this.leftUnits[pos])) {
                return this.leftUnits[positions[i]];
            }
            else if (dt.isUndefined(this.rightUnits[pos])) {
                return this.rightUnits[positions[i]];
            }
        },

        getFactionFrontUnits: function (faction) {
            if (faction) {
                return this._getUnitsByPositions([1, 2, 3]);
            }
            else {
                return this._getUnitsByPositions([7, 8, 9]);
            }
        },

        getFactionBackUnits: function (faction) {
            if (faction) {
                return this._getUnitsByPositions([4, 5, 6]);
            }
            else {
                return this._getUnitsByPositions([10, 11, 12]);
            }
        },

        getFactionUnits: function (faction) {
            if (faction) {
                return this._getUnitsByPositions([1, 2, 3, 4, 5, 6]);
            }
            else {
                return this._getUnitsByPositions([7, 8, 9, 10, 11, 12]);
            }
        },

        getFactionOppositeFrontUnit: function (position) {
            switch (position) {
                case 1:
                case 4:
                    return this._getUnitByPosition(7);
                case 2:
                case 5:
                    return this._getUnitByPosition(8);
                case 3:
                case 6:
                    return this._getUnitByPosition(9);
                case 7:
                case 10:
                    return this._getUnitByPosition(1);
                case 8:
                case 11:
                    return this._getUnitByPosition(2);
                case 9:
                case 12:
                    return this._getUnitByPosition(3);
            }
        },

        getFactionOppositeBackUnit: function (position) {
            switch (position) {
                case 1:
                case 4:
                    return this._getUnitByPosition(7);
                case 2:
                case 5:
                    return this._getUnitByPosition(8);
                case 3:
                case 6:
                    return this._getUnitByPosition(9);
                case 7:
                case 10:
                    return this._getUnitByPosition(1);
                case 8:
                case 11:
                    return this._getUnitByPosition(2);
                case 9:
                case 12:
                    return this._getUnitByPosition(3);
            }
        },

        getFactionOppositeUnits: function (position) {
            switch (position) {
                case 1:
                case 4:
                    return this._getUnitsByPositions([7, 10]);
                case 2:
                case 5:
                    return this._getUnitsByPositions([8, 11]);
                case 3:
                case 6:
                    return this._getUnitsByPositions([9, 12]);
                case 7:
                case 10:
                    return this._getUnitsByPositions([1, 4]);
                case 8:
                case 11:
                    return this._getUnitsByPositions([2, 5]);
                case 9:
                case 12:
                    return this._getUnitsByPositions([3, 6]);
            }
        }
    });
});