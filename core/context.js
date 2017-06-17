/**
 * Created by argulworm on 6/15/17.
 */

dt.Context = function (seed) {
    this.random = new dt.Random(seed);
    return this;
};