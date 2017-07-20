/**
 * Created by argulworm on 7/17/17.
 */

dt.registerClassInheritance('dt.Cls', function () {
    dt.Battleground = dt.Cls.inherit({
        ctor: function (teamdata, monster) {
            this.leftUnits = new dt.UnitGroup3x2(monster);
            this.rightUnits = new dt.UnitGroup3x2(teamdata);
            this.globalEffects = [];
        },

        getAllUnits: function () {
            return this.leftUnits.getUnits().concat(this.rightUnits.getUnits());
        },
    });
});

dt.registerClassInheritance('dt.Cls', function () {
    dt.UnitGroup3x2 = dt.Cls.inherit({
        ctor: function () {
        },
        
        getUnits: function () {
            
        }
    });
});