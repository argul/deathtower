/**
 * Created by argulworm on 6/15/17.
 */

dt.registerClassInheritance('dt.Cls', function () {
    dt.Context = dt.Cls.inherit({
        ctor: function (seed) {
            this.random = new dt.Random(seed);
        }
    });
});
