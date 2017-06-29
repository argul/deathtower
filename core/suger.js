/**
 * Created by argulworm on 6/15/17.
 */

dt.suger = {
    print: function (any) {
        if (this.isArray(any) || this.isObject(any)) {
            console.log(JSON.stringify(any, null, 2));
        }
        else {
            console.log(any);
        }
    },

    genArray: function (size, defaultValue) {
        var ret = new Array(size);
        for (var i = 0; i < size; i++) {
            ret[i] = defaultValue;
        }
        return ret;
    },

    genMatrix2D: function (colNum, rowNum, defaultValue) {
        var ret = new Array(rowNum);
        for (var i = 0; i < rowNum; i++) {
            ret[i] = this.genArray(colNum, defaultValue);
        }
        return ret;
    },

    getKeys: function (obj) {
        dt.debug.assert(dt.suger.isObject(obj));
        var ret = [];
        for (var key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            }
            ret.push(key);
        }
        return ret;
    },

    repeat: function (f, times) {
        for (var i = 0; i < times; i++) {
            f();
        }
    },

    shuffle: function (arr, ctx) {
        var len = arr.length;
        for (var i = 0; i < len - 1; i++) {
            var idx = ctx.random.randomInt(0, len - i - 1);
            idx = (idx >= len) ? (len - 1) : idx;
            var temp = arr[idx];
            arr[idx] = arr[len - i - 1];
            arr[len - i - 1] = temp;
        }
        return arr;
    },

    swap: function (arr, from, to) {
        var t = arr[from];
        arr[from] = arr[to];
        arr[to] = t;
    },

    isUndefined: function (obj) {
        return typeof obj === 'undefined';
    },

    isArray: function (obj) {
        if (Array.isArray(obj)) {
            return true;
        }
        else if (typeof obj === 'object' && Object.prototype.toString.call(obj) == '[object Array]') {
            return true;
        }
        else {
            return false;
        }
    },

    isNumber: function (obj) {
        return typeof obj == 'number' || Object.prototype.toString.call(obj) == '[object Number]';
    },

    isString: function (obj) {
        return typeof obj == 'string' || Object.prototype.toString.call(obj) == '[object String]';
    },

    isObject: function (obj) {
        return typeof obj === "object" && Object.prototype.toString.call(obj) === '[object Object]';
    },

    shallowCopy: function (obj) {
        var ret = undefined;
        var self = this;
        var atom = Object.prototype;
        var isPOD = function (obj) {
            return obj.__proto__ == atom;
        };

        if (self.isObject(obj) && isPOD(obj)) {
            ret = {};
            obj.keys().forEach(function (k) {
                ret[k] = obj[k];
            });
        }
        else if (self.isArray(obj)) {
            ret = obj.filter(function () {
                return true;
            });
        }
        else {
            dt.debug.assert(false);
        }
        return ret;
    },

    deepCopy: function (obj, destination, control) {
        var self = this;
        var atom = Object.prototype;
        var isPOD = function (obj) {
            return obj.__proto__ == atom;
        };

        if (self.isObject(obj)) {
            dt.debug.assert(isPOD(obj));
            destination = self.isUndefined(destination) ? {} : destination;
        }
        else if (self.isArray(obj)) {
            destination = self.isUndefined(destination) ? [] : destination;
        }
        else {
            dt.debug.assert(false);
        }

        var keyFilter = (control && control.keyFilter) ? control.keyFilter : function () {
            return true;
        };
        var keyMorpher = (control && control.keyMorpher) ? control.keyMorpher : function (key) {
            return key;
        };
        var arrayMorpher = (control && control.arrayMorpher) ? control.arrayMorpher : function (item, idx) {
            return item;
        };
        var override = (control && !cc.isUndefined(control.override)) ? control.override : true;

        var doCopy = function (src, dst) {
            if (src === null) {
                return null;
            }
            else if (self.isUndefined(src)) {
                return undefined;
            }
            else if (self.isObject(src)) {
                dst = dst || {};
                src.keys().forEach(function (k) {
                    if (!keyFilter(k, src[k])) return;
                    if (override || !Object.prototype.hasOwnProperty.call(dst, k)) {
                        dst[keyMorpher(k)] = doCopy(src[k]);
                    }
                });
            }
            else if (self.isArray(src)) {
                dst = dst || [];
                src.forEach(function (item, idx) {
                    dst.push(arrayMorpher(doCopy(item), idx));
                });
            }
            else {
                return src;
            }
            return dst;
        };
        doCopy(obj, destination);
        return destination;
    }
};

dt.functional = {
    for2DMatrix: function (procedure, matrix) {
        for (var idx0 = 0; idx0 < matrix.length; idx0++) {
            for (var idx1 = 0; idx1 < matrix[idx0].length; idx1++) {
                procedure(idx0, idx1, matrix[idx0][idx1]);
            }
        }
    }
};

dt.builtInExtension = function () {
    if (!Array.prototype.removeFirst) {
        Array.prototype.removeFirst = function (f) {
            for (var i = 0; i < this.length; i++) {
                if (f(this[i], i)) {
                    this.splice(i);
                }
            }
        };
    }
    if (!Array.prototype.removeAll) {
        Array.prototype.removeAll = function (f) {
            var needRemove = [];
            for (var i = this.length - 1; i >= 0; i++) {
                if (f(this[i], i)) {
                    needRemove.push(i);
                }
            }
            for (var i = 0; i < needRemove.length; i++) {
                this.splice(needRemove[i]);
            }
        };
    }
};
dt.builtInExtension();
