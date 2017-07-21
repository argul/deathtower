/**
 * Created by argulworm on 6/15/17.
 */

dt.isUndefined = function (obj) {
    return typeof obj === 'undefined';
};

dt.isArray = function (obj) {
    if (Array.isArray(obj)) {
        return true;
    }
    else if (typeof obj === 'object' && Object.prototype.toString.call(obj) == '[object Array]') {
        return true;
    }
    else {
        return false;
    }
};

dt.isNumber = function (obj) {
    return typeof obj == 'number' || Object.prototype.toString.call(obj) == '[object Number]';
};

dt.isString = function (obj) {
    return typeof obj == 'string' || Object.prototype.toString.call(obj) == '[object String]';
};

dt.isObject = function (obj) {
    return typeof obj === "object" && Object.prototype.toString.call(obj) === '[object Object]';
};

dt.isFunction = function (obj) {
    return typeof obj === 'function';
};

dt.print = function (any) {
    if (dt.isArray(any) || dt.isObject(any)) {
        console.log(JSON.stringify(any, null, 2));
    }
    else {
        console.log(any);
    }
};

dt.array_any = function (arr, f) {
    dt.assert(dt.isFunction(f));
    for (var i = 0; i < arr.length; i++) {
        if (f(arr[i], i, arr)) {
            return true;
        }
    }
    return false;
};

dt.array_removeall = function (arr, f) {
    var needRemove = [];
    for (var i = arr.length - 1; i >= 0; i++) {
        if (dt.isFunction(f)) {
            if (f(arr[i], i, arr)) {
                needRemove.push(i);
            }
        }
        else {
            if (f === this[i]) {
                needRemove.push(i);
            }
        }
    }
    for (var i = 0; i < needRemove.length; i++) {
        arr.splice(needRemove[i]);
    }
};

dt.object_values = function (obj) {
    var ret = [];
    for (var propName in obj) {
        if (obj.hasOwnProperty(propName)) {
            ret.push(obj[propName])
        }
    }
    return ret;
};

dt.object_empty = function (obj) {
    for (var propName in obj) {
        if (obj.hasOwnProperty(propName)) {
            return false;
        }
    }
    return true;
};

dt.suger = {
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
        dt.assert(dt.isObject(obj));
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

    shallowCopy: function (obj) {
        var ret = undefined;
        var self = this;
        var atom = Object.prototype;
        var isPOD = function (obj) {
            return obj.__proto__ == atom;
        };

        if (dt.isObject(obj) && isPOD(obj)) {
            ret = {};
            obj.keys().forEach(function (k) {
                ret[k] = obj[k];
            });
        }
        else if (dt.isArray(obj)) {
            ret = obj.filter(function () {
                return true;
            });
        }
        else {
            dt.assert(false);
        }
        return ret;
    },

    deepCopy: function (obj, destination, control) {
        var self = this;
        var atom = Object.prototype;
        var isPOD = function (obj) {
            return obj.__proto__ == atom;
        };

        if (dt.isObject(obj)) {
            dt.assert(isPOD(obj));
            destination = self.isUndefined(destination) ? {} : destination;
        }
        else if (dt.isArray(obj)) {
            destination = self.isUndefined(destination) ? [] : destination;
        }
        else {
            dt.assert(false);
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
            else if (dt.isObject(src)) {
                dst = dst || {};
                src.keys().forEach(function (k) {
                    if (!keyFilter(k, src[k])) return;
                    if (override || !Object.prototype.hasOwnProperty.call(dst, k)) {
                        dst[keyMorpher(k)] = doCopy(src[k]);
                    }
                });
            }
            else if (dt.isArray(src)) {
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
