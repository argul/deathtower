/**
 * Created by argulworm on 7/6/17.
 */

dt.registerClassInheritance('dt.Cls', function () {
    dt.TeamData = dt.Cls.extend({
        ctor: function (enterData) {

        },

        hasDoorKey: function (door) {
            return true;
        }
    })
});

dt.registerClassInheritance('dt.Cls', function () {
    dt.TeamEnterData = dt.Cls.extend({})
});