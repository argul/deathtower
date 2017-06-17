/**
 * Created by argulworm on 6/15/17.
 */

dt.Random = function (seed) {
    return {
        randomInt: function (min, max) {
            var ret = min + Math.floor((max - min + 1) * this.random01());
            return (ret > max) ? max : ret;
        },

        random01: function () {
            return Math.random();
        },

        randomBool: function () {
            return this.random01() < 0.5;
        }
    };
};
