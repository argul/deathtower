/**
 * Created by argulworm on 6/15/17.
 */

dt.astar = {
    seekPath: function (mapLevel, startX, startY, endX, endY, judgeConnect) {
        if (startX == endX && startY == endY) {
            dt.assert(false);
        }
        var self = this;
        var heap = [{
            x: startX,
            y: startY,
            indexInHeap: 0,
            parent: undefined,
            srcDistance: 0,
            dstDistance: Math.abs(startX - endX) + Math.abs(startY - endY)
        }];
        var deadends = {};
        var heapNodes = {};
        heapNodes[startX * 10000 + startY] = heap[0];

        var checkXY = function (x, y) {
            if (x < 0 || x > (mapLevel.width - 1)) return false;
            else if (y < 0 || y > (mapLevel.height - 1)) return false;
            else if (!dt.isUndefined(deadends[x * 10000 + y])) return false;
            else {
                if (dt.isFunction(judgeConnect)) {
                    return judgeConnect(mapLevel.getTile(x, y));
                }
                else {
                    return mapLevel.getTile(x, y) < dt.mapconst.TILE_PASS;
                }
            }
        };
        var sniffer = function (node, offsetX, offsetY) {
            var stepX = node.x + offsetX;
            var stepY = node.y + offsetY;
            if (!checkXY(stepX, stepY)) {
                return;
            }
            var existNode = heapNodes[stepX * 10000 + stepY];
            if (dt.isUndefined(existNode)) {
                var stepNode = {
                    x: stepX,
                    y: stepY,
                    parent: node,
                    srcDistance: node.srcDistance + Math.abs(offsetX) + Math.abs(offsetY),
                    dstDistance: Math.abs(stepX - endX) + Math.abs(stepY - endY)
                };
                self._heapPush(stepNode, heap);
                heapNodes[stepX * 10000 + stepY] = stepNode;
                if (stepX == endX && stepY == endY) {
                    return stepNode;
                }
            }
            else {
                var distance1 = node.srcDistance + Math.abs(offsetX) + Math.abs(offsetY);
                var distance2 = existNode.srcDistance;
                if (distance1 < distance2) {
                    existNode.srcDistance = distance1;
                    existNode.parent = node;
                    self._heapifyUpward(heap, existNode.indexInHeap);
                }
            }
        };

        var finalNode = undefined;
        while (heap.length > 0) {
            var head = this._heapPop(heap);
            delete heapNodes[head.x * 10000 + head.y];
            deadends[head.x * 10000 + head.y] = true;

            finalNode = sniffer(head, 1, 0);
            if (!dt.isUndefined(finalNode)) break;
            finalNode = sniffer(head, -1, 0);
            if (!dt.isUndefined(finalNode)) break;
            finalNode = sniffer(head, 0, 1);
            if (!dt.isUndefined(finalNode)) break;
            finalNode = sniffer(head, 0, -1);
            if (!dt.isUndefined(finalNode)) break;
        }

        if (!dt.isUndefined(finalNode)) {
            var ret = [{
                x: finalNode.x,
                y: finalNode.y
            }];
            var stepback = finalNode.parent;
            while (stepback) {
                ret.push({
                    x: stepback.x,
                    y: stepback.y
                })
                stepback = stepback.parent;
            }
            ret.pop();
            ret.reverse();
            return ret;
        }
        else {
            return undefined;
        }
    },

    _heapPush: function (node, heap) {
        heap.push(node);
        node.indexInHeap = heap.length - 1;
        this._heapifyUpward(heap, heap.length - 1);
    },

    _heapPop: function (heap) {
        var ret = heap[0];
        this._heapSwap(heap, 0, heap.length - 1);
        heap.pop();
        ret.indexInHeap = undefined;
        if (heap.length > 1) {
            this._heapifyDownward(heap, 0);
        }
        return ret;
    },

    _heapSwap: function (heap, idx1, idx2) {
        heap[idx1].indexInHeap = idx2;
        heap[idx2].indexInHeap = idx1;
        dt.suger.swap(heap, idx1, idx2);
    },

    _parentIdx: function (x) {
        return Math.floor((x + 1) / 2) - 1;
    },

    _leftChildIdx: function (x) {
        return (x + 1) * 2 - 1;
    },

    _rightChildIdx: function (x) {
        return (x + 1) * 2;
    },

    _heapifyUpward: function (heap, fromIdx) {
        var self = this;
        var worker = function (idx) {
            if (idx != 0) {
                var parentIdx = self._parentIdx(idx);
                if (self._heapNodeCompare(heap[idx], heap[parentIdx])) {
                    self._heapSwap(heap, idx, parentIdx);
                    worker(parentIdx);
                }
            }
        };
        worker(fromIdx);
    },

    _heapNodeCompare: function (lhr, rhr) {
        var d1 = lhr.srcDistance + lhr.dstDistance;
        var d2 = rhr.srcDistance + rhr.dstDistance;
        if (d1 < d2) {
            return true;
        }
        else if (d1 > d2) {
            return false;
        }
        else {
            return lhr.dstDistance < rhr.dstDistance;
        }
    },

    _heapifyDownward: function (heap, fromIdx) {
        var self = this;
        var worker = function (idx) {
            var lcIdx = self._leftChildIdx(idx);
            var rcIdx = self._rightChildIdx(idx);
            if (lcIdx >= heap.length) {
                return;
            }
            else if (rcIdx >= heap.length) {
                if (self._heapNodeCompare(heap[idx], heap[lcIdx])) {
                    self._heapSwap(heap, idx, lcIdx);
                    worker(lcIdx);
                }
            }
            else {
                if (self._heapNodeCompare(heap[idx], heap[lcIdx]) || self._heapNodeCompare(heap[idx], heap[rcIdx])) {
                    if (self._heapNodeCompare(heap[lcIdx], heap[rcIdx])) {
                        self._heapSwap(heap, idx, lcIdx);
                        worker(lcIdx);
                    }
                    else {
                        self._heapSwap(heap, idx, rcIdx);
                        worker(rcIdx);
                    }
                }
            }
        };
        worker(fromIdx);
    }
};