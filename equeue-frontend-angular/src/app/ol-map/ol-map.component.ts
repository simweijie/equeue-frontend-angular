import {Component, NgZone, AfterViewInit, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import {View, Feature, Map, Geolocation, Overlay} from 'ol';
import {Coordinate} from 'ol/coordinate';
// import {DeviceOrientation} from 'ol/DeviceOrientation'
import { ScaleLine, defaults as DefaultControls} from 'ol/control';
import proj4 from 'proj4';
import VectorLayer from 'ol/layer/Vector';
import Projection from 'ol/proj/Projection';
import {register} from 'ol/proj/proj4';
import {get as GetProjection, transform} from 'ol/proj';
import {Extent} from 'ol/extent';
import TileLayer from 'ol/layer/Tile';
import OSM, {ATTRIBUTION} from 'ol/source/OSM';


@Component({
  selector: 'app-ol-map',
  templateUrl: './ol-map.component.html',
  styleUrls: ['./ol-map.component.scss']
})
export class OlMapComponent implements  AfterViewInit {

  @Input() center: Coordinate;
  @Input() lat: any;
  @Input() lng: any;
  @Input() zoom: number;
  view: View;
  projection: Projection;
  extent: Extent = [-20026376.39, -20048966.10, 20026376.39, 20048966.10];
  Map: Map;
  geolocation: any;
  currentLocation: any;
  marker: any;
  @Output() mapReady = new EventEmitter<Map>();
  private trackFeature: any;
  // private deviceOrientation: any;

  constructor(private zone: NgZone, private cd: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    if (! this.Map) {
      this.zone.runOutsideAngular(() => this.initMap());
    }
    setTimeout(() => this.mapReady.emit(this.Map));
  }

  private initMap(): void {
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const success = (pos: any): void => {
      let crd = pos.coords;

      console.log('Your current position1 is:');
      this.lat = crd.latitude;
      console.log(`Latitude1 : ${crd.latitude}`);
      console.log(`this.Latitude1 : ${this.lat}`);
      this.lng = crd.longitude;
      console.log(`Longitude1 : ${crd.longitude}`);
      console.log(`this.Longitude1 : ${this.lng}`);
      console.log(`More or less ${crd.accuracy} meters.`);
    };

    function error(err: any): void {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error, options);

    console.log(`Latitude1 : ${this.lat}`);
    console.log(`Longitude1 : ${this.lng}`);

    proj4.defs('EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs');
    register(proj4);
    this.projection = GetProjection('EPSG:3857');
    this.projection.setExtent(this.extent);

    this.view = new View({
      // center: transform([this.lat, this.lng], 'EPSG:4326', 'EPSG:3857'),
      center: this.center,
      zoom: this.zoom
      // projection: this.projection,
    });

    this.Map = new Map({
      layers: [new TileLayer({
        source: new OSM({})
      })],
      target: 'map',
      view: this.view,
      controls: DefaultControls().extend([
        new ScaleLine({}),
      ]),
    });

    this.geolocation = new Geolocation({
      tracking: true
    });

    // bind the view's projection
    // this.geolocation.bindTo('projection', this.view);

    // when we get a position update, add the coordinate to the track's
    // geometry and recenter the view
    // this.geolocation.on('change:position', function() {
    //   const coordinate = this.geolocation.getPosition();
    //   this.view.setCenter(coordinate);
    //   this.trackFeature.getGeometry().appendCoordinate(coordinate);
    // });

    // put a marker at our current position
    // this.marker = new Overlay({
    //   element: document.getElementById('location'),
    //   positioning: 'center-center'
    // });

    // this.Map.addOverlay(this.marker);
    // this.marker.bindTo('position', this.geolocation);
    // rotate the view to match the device orientation
    // this.deviceOrientation = new DeviceOrientation({
    //   tracking: true
    // });
    //
    // this.deviceOrientation.on('change:heading', onChangeHeading);
    // function onChangeHeading(event) {
    //   const heading = event.target.getHeading();
    //   this.view.setRotation(-heading);
    // }
  }
}
