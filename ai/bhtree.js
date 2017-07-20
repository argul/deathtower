/**
 * Created by argulworm on 7/20/17.
 */

dt.registerClassInheritance('dt.Cls', function () {
    dt.BaseBHNode = dt.Cls.extend({
        ctor: function (name) {
            this.name = name;
        },

        propagate: function () {
            dt.assert(false);
        }
    });
});

dt.registerClassInheritance('dt.BaseBHNode', function () {
    dt.BHNodeAction = dt.BaseBHNode.extend({
        ctor: function (name, worker) {
            this._super(name);
            this.worker = worker;
        },

        propagate: function () {
            return this.worker();
        }
    });
});

dt.registerClassInheritance('dt.BaseBHNode', function () {
    dt.BHNodeCondAll = dt.BaseBHNode.extend({
        ctor: function (name) {
            this._super(name);
            this.judgerArr = [];
            this.trueClauseNode = undefined;
            this.falseClauseNode = undefined;
        },

        propagate: function () {
            dt.assert(this.trueClauseNode && this.falseClauseNode);
            dt.assert(this.judgerArr.length > 0);
            var r = true;
            for (var i = 0; i < this.judgerArr.length; i++) {
                if (!this.judgerArr[i]()) {
                    r = false;
                    break;
                }
            }
            if (r) {
                return this.trueClauseNode.propagate();
            }
            else {
                return this.falseClauseNode.propagate();
            }
        },

        appendJudger: function (x) {
            this.judgerArr.push(x);
        },

        setTrueClauseNode: function (x) {
            this.trueClauseNode = x;
        },

        setFalseClauseNode: function () {
            this.falseClauseNode = x;
        }
    });
});

dt.registerClassInheritance('dt.BHNodeCondAll', function () {
    dt.BHNodeCondAny = dt.BHNodeCondAll.extend({
        propagate: function () {
            dt.assert(dt.isFunction(this.trueClauseNode) && dt.isFunction(this.falseClauseNode));
            dt.assert(this.judgerArr.length > 0);
            var r = false;
            for (var i = 0; i < this.judgerArr.length; i++) {
                if (this.judgerArr[i]()) {
                    r = true;
                    break;
                }
            }
            if (r) {
                return this.trueClauseNode.propagate();
            }
            else {
                return this.falseClauseNode.propagate();
            }
        }
    });
});

dt.registerClassInheritance('dt.BaseBHNode', function () {
    dt.BHNodeChain = dt.BaseBHNode.extend({
        ctor: function (name) {
            this._super(name);
            this.nodeArr = [];
        },

        propagate: function () {
            dt.assert(this.nodeArr.length > 0);
            for (var i = 0; i < this.nodeArr.length; i++) {
                var r = this.nodeArr[i].propagate();
                if (!dt.isUndefined(r)) {
                    return r;
                }
            }
            return undefined;
        },

        appendNode: function (x) {
            this.nodeArr.push(x);
        }
    });
});

dt.registerClassInheritance('dt.BHNodeChain', function () {
    dt.BHTree = dt.BHNodeChain.extend({
        dumpTree: function () {

        }
    });
});

dt.sharedBHNodes = {
    voidAction: new dt.BHNodeAction("voidAction", function () {
        return undefined;
    })
};