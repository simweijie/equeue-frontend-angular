import {Component, ElementRef, Input, OnInit, Output, EventEmitter, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TestModService} from '../shared/services/test-mod.service';
import {Geolocation} from 'ol';
import {MatTableDataSource} from "@angular/material/table";

declare  const L: any;

@Component({
  selector: 'app-test-mod',
  templateUrl: './test-mod.component.html',
  styleUrls: ['./test-mod.component.css']
})
export class TestModComponent implements OnInit {

  gTitle = 'Google AGM project';
  lat = 51.678418;
  lng = 7.809007;
  zoom = 16;

  latitude: any;
  longitude: any;

  olTitle = 'OverLayer Maps';
  output: any;
  outputD: any;
  curMarker: any;
  mymap: any;
  zoomLvl = 13;

  constructor(
    private route: ActivatedRoute,
    private testModService: TestModService,
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

    // let options = {
    //   enableHighAccuracy: true,
    //   timeout: 5000,
    //   maximumAge: 0
    // };
    //
    // const success = (pos: any): void => {
    //   let crd = pos.coords;
    //
    //   console.log('Your current position is:');
    //   this.latitude = crd.latitude;
    //   // console.log(`Latitude : ${crd.latitude}`);
    //   // console.log(`this.Latitude : ${this.latitude}`);
    //   this.longitude = crd.longitude;
    //   // console.log(`Longitude: ${crd.longitude}`);
    //   // console.log(`this.Longitude : ${this.longitude}`);
    //   // console.log(`More or less ${crd.accuracy} meters.`);
    // };
    //
    // function error(err: any): void {
    //   console.warn(`ERROR(${err.code}): ${err.message}`);
    // }
    // navigator.geolocation.getCurrentPosition(success, error, options);
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

  testPost(): void {
    // login
    // Call the service and send to the backend
    console.log('Inside testPost statement');

    this.testModService.testPost({ username : 'customer1@hotmail.com', password : 'passw0rd123' }).subscribe(data => {
      console.log(data);
      if (data === null || data === 'ERROR') {
        this.output = 'Hello';
      } else {
        this.output = data.toString();
      }
    });
  }

  testListOfClinic(): void {
    // login
    // Call the service and send to the backend
    console.log('Inside testPost statement');

    this.testModService.testListOfClinic().subscribe(data => {
      console.log(data);
      if (data === null || data === 'ERROR') {
        this.output = 'Hello';
      } else {
        this.output = data.toString();
      }
    });
  }

  testDelete(): void {
    // deleteOpeningHours
    // Call the service and send to the backend
    console.log('Inside testDelete statement');

    this.testModService.testDelete({branchId : '5', dayOfWeek: '1'}).subscribe(data => {
      if (data === 'ERROR') {
        this.outputD = 'D Hello';
      } else {
        this.outputD = data;
      }
    });
  }

  testGeoCode(): void {
    // deleteOpeningHours
    // Call the service and send to the backend
    console.log('Inside testDelete statement');

    this.testModService.testGeoCode('750491').subscribe(data => {
      if (data === 'ERROR') {
        this.outputD = 'G Hello';
      } else {
        this.outputD = data;
      }
    });
  }

  // public onMapReady(event: any) {
  //   console.log('Map Ready');
  // }

  getBranchQueue() {
    this.testModService.getBranchQueue({staffId: 1}).subscribe(
      data => {
        console.log(data);
        // @ts-ignore
        console.log(data.data);
      });
  }
}
