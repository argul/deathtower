/**
 * Created by argulworm on 7/18/17.
 */

dt.registerClassInheritance('dt.Cls', function () {
    dt.BattleUnit = dt.Cls.extend({
        ctor: function (uid, udata) {
            this._dead = false;
            this._uid = uid;
            this._skills = [];
        },

        unitId: function () {
            return this._uid;
        },

        isDead: function () {
            return this._dead;
        },

        canTakeAction: function () {
            return true;
        },

        allSkills : function () {
            return this._skills;
        }
    });
});