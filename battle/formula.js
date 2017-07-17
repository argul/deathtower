/**
 * Created by argulworm on 6/14/17.
 */

dt.formula = {
    damage: function () {
        
    },

    _getPercent: function (pct, min, max) {
        min = dt.isUndefined(min) ? 0 : min;
        max = dt.isUndefined(max) ? 0 : max;
        var ret = pct / 100.0;
        if (ret < 0) return 0;
        else if (ret > 1) return 1;
        else return ret;
    },

    _getBool: function (pct, rnd) {
        return rnd.random01() <= this._getPercent(pct);
    }
};