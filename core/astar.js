/**
 * Created by argulworm on 6/15/17.
 */

dt.astar = {
    seekPath: function (mapLevel, startX, startY, endX, endY, judgeConnect) {
        if (startX == endX && startY == endY){
            dt.assert(false);
        }
        var self = this;
        var heap = [{
            x: startX,
            y: startY,
            parent: undefined,
            srcDistance: 0,
            dstDistance: Math.abs(startX - endX) + Math.abs(startY - endY)
        }];
        var visited = {};
        var heapNodes = {};
        heapNodes[startX * 10000 + startY] = heap[0];

        var checkXY = function (x, y) {
            if (x < 0 || x > (mapLevel.width - 1)) return false;
            else if (y < 0 || y > (mapLevel.height - 1)) return false;
            else if (!dt.isUndefined(visited[x * 10000 + y])) return false;
            else {
                if (dt.isFunction(judgeConnect)){
                    return judgeConnect(mapLevel.getTile(x, y));
                }
                else{
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
                if (stepX == endX && stepY == endY) {
                    return stepNode;
                }
            }
            else {
                var distance1 = node.srcDistance + Math.abs(offsetX) + Math.abs(offsetY);
                var distance2 = existNode.srcDistance;
                if (distance1 < distance2) {
                    existNode.srcDistance = distance1;
                    self._heapifyUpward(heap, existNode.indexInHeap);
                }
            }
        };
        var recon = function (node) {
            var n = undefined;
            visited[node.x * 10000 + node.y] = true;
            n = sniffer(node, 0, 1);
            if (!dt.isUndefined(n)) return n;
            n = sniffer(node, 0, -1);
            if (!dt.isUndefined(n)) return n;
            n = sniffer(node, 1, 0);
            if (!dt.isUndefined(n)) return n;
            n = sniffer(node, -1, 0);
            if (!dt.isUndefined(n)) return n;
            return undefined;
        };

        var finalNode = undefined;
        while (heap.length > 0) {
            var n = this._heapPop(heap);
            delete heapNodes[n.x * 10000 + n.y];
            finalNode = recon(n);
            if (!dt.isUndefined(finalNode)) {
                break;
            }
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
        dt.suger.swap(heap, idx1, idx2);
        heap[idx1].indexInHeap = idx2;
        heap[idx2].indexInHeap = idx1;
    },

    _heapifyUpward: function (heap, fromIdx) {
        var worker = function (idx) {
            if (idx != 0) {
                var parentIdx = Math.floor(idx / 2);
                if ((heap[idx].srcDistance + heap[idx].dstDistance)
                    < (heap[parentIdx].srcDistance + heap[parentIdx].dstDistance)) {
                    this._heapSwap(heap, idx, parentIdx);
                    worker(parentIdx);
                }
            }
        };
        worker(fromIdx);
    },

    _heapifyDownward: function (heap, fromIdx) {
        var worker = function (idx) {
            var lcIdx = idx * 2;
            var rcIdx = idx * 2 + 1;
            if (lcIdx >= heap.length) {
                return;
            }
            else if (rcIdx >= heap.length) {
                var d1 = heap[idx].srcDistance + heap[idx].dstDistance;
                var d2 = heap[lcIdx].srcDistance + heap[lcIdx].dstDistance;
                if (d2 < d1) {
                    this._heapSwap(heap, idx, lcIdx);
                    worker(lcIdx);
                }
            }
            else {
                var d1 = heap[idx].srcDistance + heap[idx].dstDistance;
                var d2 = heap[lcIdx].srcDistance + heap[lcIdx].dstDistance;
                var d3 = heap[rcIdx].srcDistance + heap[rcIdx].dstDistance;
                if (d2 < d1 || d3 < d1) {
                    if (d2 < d3) {
                        this._heapSwap(heap, idx, lcIdx);
                        worker(lcIdx);
                    }
                    else {
                        this._heapSwap(heap, idx, rcIdx);
                        worker(rcIdx);
                    }
                }
            }
        };
        worker(fromIdx);
    }
};