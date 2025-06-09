import { accesToken, uriPath } from "./cesiumConfig.js";
import { flightData } from "./Coordinates.js";
import { MovingObject } from "./MovingObject.js";
// Your access token can be found at: https://ion.cesium.com/tokens.
Cesium.Ion.defaultAccessToken = accesToken;
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain(),
});

const buildingTileset = await Cesium.createOsmBuildingsAsync();
viewer.scene.primitives.add(buildingTileset);



const movingObject = new MovingObject(viewer, flightData, 1);
movingObject.addMovableEntityToViewer(uriPath["aircraft"]);