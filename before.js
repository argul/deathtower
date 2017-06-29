/**
 * Created by argulworm on 6/17/17.
 */

var dt = dt || {};

dt.Class = function () {
};
dt.Class.extend = function (prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = Object.create(_super);
    initializing = false;
    fnTest = /xyz/.test(function () {
        xyz;
    }) ? /\b_super\b/ : /.*/;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
        // Check if we're overwriting an existing function
        prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
            (function (name, fn) {
                return function () {
                    var tmp = this._super;

                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = _super[name];

                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;

                    return ret;
                };
            })(name, prop[name]) :
            prop[name];
    }

    // The dummy class constructor
    function Class() {
        // All construction is actually done in the init method
        if (!initializing) {
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
    Class.extend = arguments.callee;

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
                    dt.debug.assert(false);
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