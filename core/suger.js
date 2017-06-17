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

    shuffle: function (arr) {
        var len = arr.length;
        for (var i = 0; i < len - 1; i++) {
            var idx = Math.floor(Math.random() * (len - i));
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
            dt.functional.foreach(function (k, v) {
                ret[k] = v;
            }, obj);
        }
        else if (self.isArray(obj)) {
            ret = dt.functional.filter(function () {
                return true;
            }, obj);
        }
        else {
            throw "e";
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
            if (isPOD(obj)) {
                destination = self.isUndefined(destination) ? {} : destination;
            }
            else {
                throw "e";
            }
        }
        else if (self.isArray(obj)) {
            destination = self.isUndefined(destination) ? [] : destination;
        }
        else {
            throw "e";
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
                dt.functional.foreach(function (propName, propValue) {
                    if (!keyFilter(propName, propValue)) return;
                    if (override || !Object.prototype.hasOwnProperty.call(dst, propName)) {
                        dst[keyMorpher(propName)] = doCopy(propValue);
                    }
                }, src, true);
            }
            else if (self.isArray(src)) {
                dst = dst || [];
                dt.functional.foreach(function (item, idx) {
                    dst.push(arrayMorpher(doCopy(item), idx));
                }, src);
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
    foreach: function (procedure, any) {
        if (dt.suger.isArray(any)) {
            this._foreachArr(procedure, any);
        }
        else if (dt.suger.isString(any)) {
            this._foreachChar(procedure, any);
        }
        else if (dt.suger.isObject(any)) {
            this._foreachObj(procedure, any);
        }
        else {
            throw "e";
        }
    },

    map: function (procedure, arr) {
        var ret = [];
        this._foreachArr(function (item, idx) {
            ret.push(procedure(item, idx));
        }, arr);
        return ret;
    },

    reduce: function (procedure, arr, nullValue) {
        if (arr.length <= 0) {
            return nullValue;
        }
        else {
            var car = arr.unshift();
            return procedure(car, this.reduce(procedure, arr, nullValue));
        }
    },

    filter: function (procedure, arr) {
        var ret = [];
        this.foreachArr(function (item, idx) {
            if (procedure(item, idx)) {
                ret.push(item);
            }
        }, arr);
        return ret;
    },

    _foreachArr: function (procedure, arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
            procedure(arr[i], i);
        }
    },

    _foreachObj: function (procedure, obj) {
        for (var propName in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, propName)) {
                procedure(propName, obj[propName]);
            }
        }
    },

    _foreachChar: function (procedure, str) {
        for (var i = 0, len = str.length; i < len; i++) {
            procedure(str[i], i);
        }
    }
};
