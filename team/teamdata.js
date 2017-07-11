/**
 * Created by argulworm on 7/6/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.TeamData = dt.Class.extend({
        ctor: function (enterData) {

        },

        hasDoorKey: function (door) {
            return true;
        }
    })
});

dt.registerClassInheritance('dt.Class', function () {
    dt.TeamEnterData = dt.Class.extend({})
});