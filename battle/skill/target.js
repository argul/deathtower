/**
 * Created by argulworm on 8/11/17.
 */

dt.targetcode = {
    SFFR: "SINGLE_FRONT_FIRST_RANDOM"
};

dt.targetSeeker = {
    seek: function (targetcode, myUnit, abacusRef) {
        var f = this._getSeeker(targetcode);
        return f(myUnit, abacusRef);
    },

    _seekers: undefined,

    _getSeeker: function (code) {
        if (dt.isUndefined(this._seekers)) {
            this._seekers = {};
            for (var c in dt.targetcode) {
                var h = this['_seeker_' + c];
                dt.assert(!dt.isUndefined(h));
                this._seekers[c] = h;
            }
        }
        return this._seekers[code];
    },

    _seeker_SFFR: function (myUnit, abacusRef) {
        var rnd = abacusRef.rnd;
        var front = abacusRef.battleground.getFactionFrontUnits(!myUnit.getFaction());
        if (front.length > 0){
            return rnd.randomChoice(front);
        }
        else{
            var back = abacusRef.battleground.getFactionBackUnits(!myUnit.getFaction());
            dt.assert(back.length > 0);
            return rnd.randomChoice(back);
        }
    }
};