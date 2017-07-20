/**
 * Created by argulworm on 6/17/17.
 */

"use strict";

var dt = dt || {};

dt.Class = function () {
};
var __g_initializing = false;
dt.Class.extend = function (prop) {
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    __g_initializing = true;
    var prototype = Object.create(this.prototype);
    __g_initializing = false;
    // Copy the properties over onto the new prototype
    for (var name in prop) {
        // Check if we're overwriting an existing function
        prototype[name] = prop[name];
    }

    // The dummy class constructor
    function Class() {
        // All construction is actually done in the init method
        if (!__g_initializing) {
            if (this.ctor) {
                this.ctor.apply(this, arguments);
            }
        }
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = dt.Class.extend;

    return Class;
};

dt.__pendingClassDefiners = [];
dt.registerClassInheritance = function (baseClsLex, definer) {
    var baseCls = eval(baseClsLex);
    if (typeof baseCls === 'undefined') {
        dt.__pendingClassDefiners.push({
            baseClsLex: baseClsLex,
            definer: definer
        });
    }
    else {
        definer();
    }
};
dt.flushClassInheritance = function () {
    var isBaseClsUndefined = function (baseClsLex) {
        var baseCls = eval(baseClsLex);
        return (typeof baseCls === 'undefined')
    };
    var sortFunc = function (x, y) {
        var xc = isBaseClsUndefined(x.baseClsLex);
        var yc = isBaseClsUndefined(y.baseClsLex);
        if (!xc && yc) {
            return -1;
        }
        else if (xc && !yc) {
            return 1;
        }
        else {
            return 0;
        }
    };
    while (dt.__pendingClassDefiners.length > 0) {
        dt.__pendingClassDefiners.sort(sortFunc);
        for (var i = 0; i < dt.__pendingClassDefiners.length; i++) {
            var d = dt.__pendingClassDefiners[i];
            if (isBaseClsUndefined(d.baseClsLex)) {
                if (i == 0) {
                    dt.assert(false);
                }
                else {
                    dt.__pendingClassDefiners.splice(0, i);
                    break;
                }
            }
            else {
                d.definer();
                if (i == dt.__pendingClassDefiners.length - 1) {
                    dt.__pendingClassDefiners = [];
                }
            }
        }
    }
    dt.__pendingClassDefiners = [];
};