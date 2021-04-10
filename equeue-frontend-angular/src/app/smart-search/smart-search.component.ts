import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SmartSearchService} from '../shared/services/smart-search.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {CommonService} from '../shared/services/common.service';

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
  // pCode: any;
  mGroupList: string | Object | null | string = [{id: '1', value: 'Happy Clinic'}];
  curLat = 0;
  curLong = 0;

  districtList: Array<object> = [
    {id: 'N', value: 'North'},
    {id: 'NE', value: 'North-East'},
    {id: 'East', value: 'East'},
    {id: 'SE', value: 'South-East'},
    {id: 'S', value: 'South'},
    {id: 'SW', value: 'South-West'},
    {id: 'West', value: 'West'},
    {id: 'NW', value: 'North-West'}
  ];
  // private _filterResults: { clicicId?: string; clicicName?: string; currentOperation?: string; queueLength?: string };
  filterList: any;
  clinicId: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private smartSearchService: SmartSearchService,
    private commonService: CommonService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    // this._filterResults = new class {
    //   clicicId?: string;
    //   clinicName?: string;
    //   currentOperation?: string;
    //   queueLength?: string;
    // };
    if (!navigator.geolocation) {
      console.log('Location is not supported!');
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const coord = position.coords;
      const latLong = [coord.latitude, coord.longitude];
      this.curLat = coord.latitude;
      this.curLong = coord.longitude;
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

      this.curMarker.bindPopup('<b>Current Location</b>').openPopup();
      // let listOfMarkers = L.marker(['1.3857469999999998', '103.837870']).addTo(this.mymap);
      // listOfMarkers.bindPopup('<b>Clinic Name: {{entry.clinicName}}} <br> Current Operation: {{entry.currentOperation}} <br> Queue Length: {{entry.queueLength}}</b><br><button>Click</button>').openPopup();
      // this.listOfMarkers[1] = L.marker(['1.3857469999999998', '103.837875']).addTo(this.mymap);
      // this.listOfMarkers[1].bindPopup('<b>Hi 2</b>').openPopup();

      // let popup = L.popup()
      //   .setLatLng(latLong)
      //   .setContent(
      //     'Test Button: ' +
      //     document.createElement('button')
      //   )
      //   .openOn(this.mymap);
    });
    this.watchPosition();

    this.isDataAvailable = false;
    // Get the medical group list
    this.commonService.retrieveClinicList().subscribe(
      data => {
        console.log(data);
        if (data !== 'ERROR') {
          this.mGroupList = data;
        }
      });
  }

  watchPosition() {
    // let desLat = 0;
    // let desLon = 0;
    let id = navigator.geolocation.watchPosition((position) => {
      const coord = position.coords;
      const latLong = [coord.latitude, coord.longitude];
      console.log(`lat: ${position.coords.latitude}, lon: ${position.coords.longitude}`);
      if (position.coords.latitude === this.curLat && position.coords.longitude === this.curLong) {
        navigator.geolocation.clearWatch(id);
      }
      else {
        // desLat = position.coords.latitude;
        // desLon = position.coords.longitude;
        this.curLat = coord.latitude;
        this.curLong = coord.longitude;
        this.curMarker = L.marker(latLong).addTo(this.mymap);
        this.curMarker.bindPopup('<b>Current Location</b>').openPopup();
      }
    }, (err) => {
      console.log(err);
    }, {
      enableHighAccuracy: true, // High accuracy (true)
      timeout: 5000, // 5 sec
      maximumAge: 0 // no cache
    });
  }

  searchGP() {
    console.log('searchGp');
    if (this.curLat !== 0 && this.curLong !== 0) {
      this.smartSearchService.searchByGP({lat: this.curLat, long: this.curLong}).subscribe(
        data => {
          console.log(data);
          if (data !== null || data !== 'ERROR') {
            this.filterList = data;
            for (let entry of this.filterList) {
              const latLong = [entry.lat, entry.long];
              let listOfMarkers = L.marker(latLong).addTo(this.mymap);
              listOfMarkers.bindPopup('<b>Clinic Name: {{entry.clinicName}}} <br> Current Operation: {{entry.currentOperation}} <br> Queue Length: {{entry.queueLength}}</b><br><button class="btn-primary col-sm-1" (click)="addQueue(entry.clinicId)">Join Queue</button>');
            }
          }
        });
    }
  }

  searchFilter() {
    console.log('searchFilter');
    // this._filterResults = new class {
    //   clicicId?: string;
    //   clinicName?: string;
    //   currentOperation?: string;
    //   queueLength?: string;
    // };
    if (this.district !== undefined && this.mGroup !== undefined) {
      this.smartSearchService.searchByDistrictOrMGroup({district: this.district, clinic: this.mGroup}).subscribe(
        data => {
          console.log(data);
          if (data !== null || data !== 'ERROR') {
            this.filterList = data;
            for (let entry of this.filterList) {
              const latLong = [entry.lat, entry.long];
              let listOfMarkers = L.marker(latLong).addTo(this.mymap);
              listOfMarkers.bindPopup('<b>Clinic Name: {{entry.clinicName}}} <br> Current Operation: {{entry.currentOperation}} <br> Queue Length: {{entry.queueLength}}</b><br><button class="btn-primary col-sm-1" (click)="addQueue(entry.clinicId)">Join Queue</button>');
            }
          }
        });
    }
  }

  addQueue(clinicId: any) {
    console.log('addQueue - clinicId:');
    console.log(clinicId);
    this.clinicId = clinicId;
    if (this.clinicId !== null || this.clinicId !== '') {
      this.router.navigate(['/patient-login', { clinicId: this.clinicId }]);
    }
  }
}
