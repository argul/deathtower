/**
 * Created by argulworm on 7/18/17.
 */

dt.registerClassInheritance('dt.Cls', function () {
    dt.BattleUnit = dt.Cls.extend({
        ctor: function (uid, position, faction, udata) {
            this._dead = false;
            this._uid = uid;
            this._position = position;
            this._faction = faction;
            this._skills = [];
            this._attrs = {};
            this._finalattrs = {};
        },

        getPosition: function () {
            return this._position;
        },

        getFaction: function () {
            return this._faction;
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
        },

        finalAttrs: function () {
            return this._finalattrs;
        }
    });
});