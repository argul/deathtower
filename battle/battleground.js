/**
 * Created by argulworm on 7/17/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.Battleground = dt.Class.extend({
        ctor: function (teamdata, monster) {
            this.leftUnits = new dt.UnitGroup3x2(monster);
            this.rightUnits = new dt.UnitGroup3x2(teamdata);
            this.globalEffects = [];
        }
    });
});

dt.registerClassInheritance('dt.Class', function () {
    dt.UnitGroup3x2 = dt.Class.extend({
        ctor: function () {
        }
    });
});