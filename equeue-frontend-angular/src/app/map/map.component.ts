import { Component, OnInit, Input, Output,  SimpleChanges, EventEmitter } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import {transform} from 'ol/proj';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { AppStateService } from '../state/appstate.service';

const INITIAL_OPACITY = 1;
const DIMMED_OPACITY = 0.3;

@Component({
  selector: 'map',
  template: `<div id="map"></div>`,
  styleUrls: ['map.component.css']
})
export class MapComponent implements OnInit{

  private map: any;
  lat: any;
  lng: any;

  constructor(private appStateService: AppStateService) {
  }

  ngOnInit(): void {
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const success = (pos: any): void => {
      let crd = pos.coords;

      console.log('Your current position2 is:');
      this.lat = crd.latitude;
      console.log(`Latitude2 : ${crd.latitude}`);
      console.log(`this.Latitude2 : ${this.lat}`);
      this.lng = crd.longitude;
      console.log(`Longitude2: ${crd.longitude}`);
      console.log(`this.Longitude2 : ${this.lng}`);
      console.log(`More or less ${crd.accuracy} meters.`);
    };

    function error(err: any): void {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error, options);

    this.map = new Map({
      layers: [
        new Tile({ source: new OSM(), opacity: INITIAL_OPACITY }),
      ],
      target: 'map',
      view: new View({
        // center: transform([this.lat, this.lng], 'EPSG:4326', 'EPSG:3857'),
        center: transform([-0.12755, 51.507222], 'EPSG:4326', 'EPSG:3857'),
        zoom: 3
      })
    });
    this.appStateService.getDim().subscribe(
      x => {
        if (x) {
          this.map.getLayers().getArray()[0].setOpacity(INITIAL_OPACITY);
        } else {
          this.map.getLayers().getArray()[0].setOpacity(DIMMED_OPACITY);
        }
      }
    );
  }
}
