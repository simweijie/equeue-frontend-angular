import { Component, OnInit } from '@angular/core';
import {SmartSearchService} from "../shared/services/smart-search.service";

declare  const L: any;

@Component({
  selector: 'app-smart-search',
  templateUrl: './smart-search.component.html',
  styleUrls: ['./smart-search.component.css']
})
export class SmartSearchComponent implements OnInit {
  isDataAvailable: boolean = true;
  active = 1;
  curMarker: any;
  mymap: any;
  zoomLvl = 13;
  mGroup: any;
  district: any;
  pCode: any;
  districtList: any;
  mGroupList: any;

  constructor(
    private smartSearchServic: SmartSearchService
  ) { }

  ngOnInit(): void {
    if (!navigator.geolocation) {
      console.log('Location is not supported!');
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const coord = position.coords;
      const latLong = [coord.latitude, coord.longitude];
      console.log(`lat: ${position.coords.latitude}, lon: ${position.coords.longitude}`);
      this.mymap = L.map('map').setView(latLong, this.zoomLvl);
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmhhYXJhdGhhbjIzIiwiYSI6ImNrbXI3dnlldjA0eHgydW14aHNuMWp0ZTAifQ.nhX-ShZqV8Q251Vreo23Fw', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token'
      }).addTo(this.mymap);

      this.curMarker = L.marker(latLong).addTo(this.mymap);

      this.curMarker.bindPopup('<b>Hi</b>').openPopup();

      // let popup = L.popup()
      //   .setLatLng(latLong)
      //   .setContent('I am Barath.')
      //   .openOn(mymap);
    });
    this.watchPosition();

    this.isDataAvailable = false;
    this.smartSearchServic.retrieveCodeValue().subscribe(
      data => {
        // this.isOverlayVisible = false;
        this.isDataAvailable = true;
        if (data === null) {
          // this._error.next(this.error500);
        } else {
          // this.ctMaster = data;
          // console.log('This is the ctMaster Value: ');
          // console.log(this.ctMaster);
          // console.log(this.ctMaster.ctCtry);
          // this.countryList = this.ctMaster.ctCtry;
          // this.countryMap = new Map<string, string>();
          // for (let entry of this.countryList) {
          //   this.countryMap.set(entry.cdValue, entry.cdDescription);
          // }
          // console.log(this.ctMaster.ctColour);
          // this.colourList = this.ctMaster.ctColour;
          // this.colourMap = new Map<string, string>();
          // for (let entry of this.colourList) {
          //   this.colourMap.set(entry.cdValue, entry.cdDescription);
          // }
          //
          // console.log(this.ctMaster.ctImmStat);
          // this.immStatList = this.ctMaster.ctImmStat;
          // this.immStatMap = new Map<string, string>();
          // for (let entry of this.immStatList) {
          //   this.immStatMap.set(entry.cdValue, entry.cdDescription);
          // }
          // console.log(this.ctMaster.ctNalty);
          // this.nationalityList = this.ctMaster.ctNalty;
          // this.nationalityMap = new Map<string, string>();
          // for (let entry of this.nationalityList) {
          //   this.nationalityMap.set(entry.cdValue, entry.cdDescription);
          // }
        }
      });
  }

  watchPosition() {
    let desLat = 0;
    let desLon = 0;
    let id = navigator.geolocation.watchPosition((position) => {
      const coord = position.coords;
      const latLong = [coord.latitude, coord.longitude];
      console.log(`lat: ${position.coords.latitude}, lon: ${position.coords.longitude}`);
      if (position.coords.latitude === desLat && position.coords.longitude === desLon) {
        navigator.geolocation.clearWatch(id);
      }
      else {
        desLat = position.coords.latitude;
        desLon = position.coords.longitude;
        this.curMarker = L.marker(latLong).addTo(this.mymap);

        this.curMarker.bindPopup('<b>Hi</b>').openPopup();
      }
    }, (err) => {
      console.log(err);
    }, {
      enableHighAccuracy: true, // High accuracy (true)
      timeout: 5000, // 5 sec
      maximumAge: 0 // no cache
    });
  }

  searchPCode() {

  }

  searchFilter() {

  }
}
