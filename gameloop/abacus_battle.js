/**
 * Created by argulworm on 7/17/17.
 */

dt.registerClassInheritance('dt.Class', function () {
    dt.AbacusBattle = dt.Class.extend({
        ctor : function (teamdata) {
            this.battleground = new dt.Battleground(teamdata);
        }
    });
});