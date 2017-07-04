/**
 * Created by argulworm on 7/4/17.
 */

dt.astar_test = function () {
    var mapLevel = new dt.MapLevel(2, 2);
    mapLevel.foreachTile(function (x, y) {
        mapLevel.setTile(x, y, dt.mapconst.TILE_CORRIDOR);
    });
    var path = dt.astar.seekPath(mapLevel, 0, 0, 1, 1)
    dt.print(JSON.stringify(path, null, 2));
};