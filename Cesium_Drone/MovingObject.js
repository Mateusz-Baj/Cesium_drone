export class MovingObject {
  constructor(viewer, filghtData, timeStepInSeconds) {
    this.viewer = viewer;
    this.filghtData = filghtData;
    this.timeStepInSeconds = timeStepInSeconds;
    this.start = Cesium.JulianDate.fromIso8601("2025-05-10T23:10:00Z");
    this.stop = Cesium.JulianDate.addSeconds(
      this.start,
      this.filghtData.features.length * this.timeStepInSeconds,
      new Cesium.JulianDate()
    );
    this._confingTime();
    this.positionProperty = this._computeTimePositionAdjastment();
  }

  _confingTime = () => {
    this.viewer.clock.startTime = this.start.clone();
    this.viewer.clock.stopTime = this.stop.clone();
    this.viewer.clock.currentTime = this.start.clone();
    this.viewer.timeline.zoomTo(this.start, this.stop);
    this.viewer.clock.multiplier = 2;
    this.viewer.clock.shouldAnimate = true;
  };

  _computeTimePositionAdjastment = () => {
    const positionProperty = new Cesium.SampledPositionProperty();
    this.filghtData.features.forEach((feature, i) => {
      const time = Cesium.JulianDate.addSeconds(
        this.start,
        i * this.timeStepInSeconds,
        new Cesium.JulianDate()
      );
      let lon = feature.geometry.coordinates[0];
      let lat = feature.geometry.coordinates[1];
      let alt = feature.properties.height + 200;
      const position = Cesium.Cartesian3.fromDegrees(lon, lat, alt);
      positionProperty.addSample(time, position);

      this.viewer.entities.add({
        description: `Location: (${lon}, ${lat}, ${alt})`,
        position: position,
        point: { pixelSize: 1, color: Cesium.Color.RED },
      });
    });
    return positionProperty;
  };
  addMovableEntityToViewer = (uri) => {
    const airplaneEntity = this.viewer.entities.add({
      availability: new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({ start: this.start, stop: this.stop }),
      ]),
      position: this.positionProperty,
      model: { uri: uri },
      orientation: new Cesium.VelocityOrientationProperty(
        this.positionProperty
      ),
      viewFrom: new Cesium.Cartesian3(-100, 0, 100)
    });

    this.viewer.trackedEntity = airplaneEntity;
  };
}
