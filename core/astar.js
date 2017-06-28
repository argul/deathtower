/**
 * Created by argulworm on 6/15/17.
 */

dt.astar = {
    seekPath: function (mapLevel, startX, startY, endX, endY) {
        var self = this;
        var mapWidth = mapLevel[0].length;
        var mapHeight = mapLevel.length;
        var heap = [{
            x: startX,
            y: startY,
            parent: undefined,
            srcDistance: 0,
            dstDistance: Math.abs(startX - endX) + Math.abs(startY - endY)
        }];
        var visited = {};

        var checkXY = function (x, y) {
            if (x < 0 || x > (mapWidth - 1)) return false;
            else if (y < 0 || y > (mapHeight - 1)) return false;
            else if (!dt.suger.isUndefined(x * 10000 + y)) return false;
            else {
                return mapLevel[y][x] != dt.mapgen.TILE_WALL;
            }
        };
        var markNode = function (node, offsetX, offsetY) {
            var ret = {
                x: node.x + offsetX,
                y: node.y + offsetY,
                parent: node,
                srcDistance: node.srcDistance + Math.abs(offsetX) + Math.abs(offsetY),
                dstDistance: Math.abs(node.x + offsetX - endX) + Math.abs(node.y + offsetY - endY)
            };
            self._addNodeToHeap(ret, heap);
            return ret;
        };
        var sniffer = function (node) {
            var n = undefined;
            visited[node.x * 10000 + node.y] = true;
            if (checkXY(node.x, node.y + 1)) {
                n = markNode(node, 0, 1);
                if (n.dstDistance == 0) {
                    return n;
                }
            }
            if (checkXY(node.x, node.y - 1)) {
                n = markNode(node, 0, -1);
                if (n.dstDistance == 0) {
                    return n;
                }
            }
            if (checkXY(node.x + 1, node.y)) {
                n = markNode(node, 1, 0);
                if (n.dstDistance == 0) {
                    return n;
                }
            }
            if (checkXY(node.x - 1, node.y)) {
                n = markNode(node, -1, 0);
                if (n.dstDistance == 0) {
                    return n;
                }
            }
            return undefined;
        };

        var finalNode = undefined;
        while (heap.length > 0) {
            finalNode = sniffer(this._popHeapTop(heap));
            if (!dt.suger.isUndefined(finalNode)) {
                break;
            }
        }

        if (!dt.suger.isUndefined(finalNode)) {
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
            ret.reverse();
            ret.shift();
            return ret;
        }
        else {
            return undefined;
        }
    },

    _addNodeToHeap: function (node, heap) {
        heap.push(node);
        this._heapifyUpward(heap, heap.length - 1);
    },

    _popHeapTop: function (heap) {
        var ret = heap[0];
        dt.suger.swap(heap, 0, heap.length - 1);
        heap.pop();
        if (heap.length > 1) {
            this._heapifyFull(heap);
        }
        return ret;
    },

    _heapifyUpward: function (heap, fromIdx) {
        var worker = function (idx) {
            if (idx != 0) {
                var parentIdx = Math.floor(idx / 2);
                if ((heap[idx].srcDistance + heap[idx].dstDistance)
                    < (heap[parentIdx].srcDistance + heap[parentIdx].dstDistance)) {
                    dt.suger.swap(heap, idx, parentIdx);
                    worker(parentIdx);
                }
            }
        };
        worker(fromIdx);
    },

    _heapifyFull: function (heap) {
        var end = heap.length - 1;
        var start = Math.floor(end / 2) + 1;
        for (var idx = end; idx >= start; --idx) {
            this._heapifyUpward(heap, idx);
        }
    }
};