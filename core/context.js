/**
 * Created by argulworm on 6/15/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.Context = dt.Class.extend({
        ctor: function (seed) {
            this.random = new dt.Random(seed);
        }
    });
});
