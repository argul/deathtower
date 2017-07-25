/**
 * Created by argulworm on 6/15/17.
 */

dt.Random = function (seed) {
    var _seed = seed;
    return {
        random01: function () {
            //return Math.random();
            _seed = _seed * 951413 + 314159;
            _seed = _seed % 3214567;
            if (_seed * 2 > 3214567)
                _seed = _seed + 1;
            return _seed / 3214567;
        },

        randomInt: function (min, max) {
            var ret = min + Math.floor((max - min + 1) * this.random01());
            return (ret > max) ? max : ret;
        },

        randomOdd: function (min, max) {
            dt.assert(dt.math.isOdd(min));
            dt.assert(dt.math.isOdd(max));
            return min + this.randomInt(0, (max - min) / 2) * 2;
        },

        randomEven: function (min, max) {
            dt.assert(dt.math.isEven(min));
            dt.assert(dt.math.isEven(max));
            return min + this.randomInt(0, (max - min) / 2) * 2;
        },

        randomBool: function () {
            return this.random01() < 0.5;
        },

        randomChoice: function (any) {
            if (dt.isArray(any)) {
                dt.assert(any.length > 0);
                return any[this.randomInt(0, any.length - 1)];
            }
            else if (dt.isObject(any)) {
                var arr = Object.keys(any);
                dt.assert(arr.length > 0);
                return any[this.randomInt(0, arr.length - 1)];
            }
            else {
                dt.assert(false);
            }
        }
    };
};
