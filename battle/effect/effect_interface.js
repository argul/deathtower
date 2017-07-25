/**
 * Created by argulworm on 7/25/17.
 */

dt.registerClassInheritance('dt.Cls', function () {
    dt.EffectInterface = dt.Cls.extend({
        initWithData: function (effectdata) {
            dt.assert(false);
        },

        affectTarget: function (performer, target) {
            dt.assert(false);
        }
    });
});

dt.effectClsMap = {
    _clsmap: undefined,
    getCls : function (effectcode) {
        if (dt.isUndefined(this._clsmap)){
            this._initClsMap();
        }
        return this._clsmap[effectcode];
    },

    _initClsMap: function () {
        this._clsmap = {};
        this._clsmap[dt.effectcode.PHYSICAL_DAMAGE] = dt.Effect_PhysicalDamage;
        this._clsmap[dt.effectcode.MAGICAL_DAMAGE] = undefined;
    }
};
