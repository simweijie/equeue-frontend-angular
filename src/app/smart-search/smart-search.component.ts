import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SmartSearchService} from '../shared/services/smart-search.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {CommonService} from '../shared/services/common.service';
import {GlobalConstants} from '../shared/global-constants';
import {bindCallback} from "rxjs";

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
  mGroupList: any;
  curLat = 0;
  curLong = 0;

  districtList: Array<object> = [
    {id: 'N', value: 'North'},
    {id: 'NE', value: 'North-East'},
    {id: 'E', value: 'East'},
    {id: 'SE', value: 'South-East'},
    {id: 'S', value: 'South'},
    {id: 'SW', value: 'South-West'},
    {id: 'W', value: 'West'},
    {id: 'NW', value: 'North-West'}
  ];
  // private _filterResults: { clicicId?: string; clicicName?: string; currentOperation?: string; queueLength?: string };
  filterList: any;
  branchId: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private smartSearchService: SmartSearchService,
    private commonService: CommonService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
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
        // @ts-ignore
        console.log(data.data);
        if (data !== 'ERROR') {
          // @ts-ignore
          this.mGroupList = data.data;
        }
      });
    this.listOfBranches();
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
      timeout: 30000, // 30 sec
      maximumAge: 0 // no cache
    });
  }

  listOfBranches() {
    console.log('listOfBranches');
    this.smartSearchService.listOfBranches().subscribe(
      data => {
        console.log(data);
        if (data !== null && data !== 'ERROR') {
          // @ts-ignore
          this.filterList = data.data;
          for (let entry of this.filterList) {
            console.log('latt: ' + entry.latt + ', longt: ' + entry.longt);
            if (entry.latt !== null  && entry.longt !== null) {
              const latLong = [entry.latt, entry.longt];
              let listOfMarkers = L.marker(latLong).addTo(this.mymap);
              const popup = L.popup().setContent('<b>Branch Name: ' + entry.name + '<br>Current Operation: ' + entry.opens + '-' + entry.closes + '<br>Queue Length: ' + entry.queueLength + '</b><br><button id="btn-' + entry.id + '" type="button" class="btn-primary col-sm" style="min-width: 100px; max-width: 100px"">Join Queue</button>').setLatLng(latLong);
              this.mymap.openPopup(popup);
              const buttonSubmit = L.DomUtil.get('btn-' + entry.id);
              L.DomEvent.addListener(buttonSubmit, 'click', (ee: any) => {
                this.addQueue(entry.id);
              });
              listOfMarkers.bindPopup(popup);
            }
          }
        } else {
          console.log('No Search GP');
        }
      });
  }

  searchGP() {
    console.log('searchGp');
    if (this.curLat !== 0 && this.curLong !== 0) {
      this.smartSearchService.searchByGP({latt: this.curLat, longt: this.curLong}).subscribe(
        data => {
          console.log(data);
          if (data !== null && data !== 'ERROR') {
            // @ts-ignore
            this.filterList = data.data;
            for (let entry of this.filterList) {
              console.log('latt: ' + entry.latt + ', longt: ' + entry.longt);
              if (entry.latt !== null  && entry.longt !== null) {
                const latLong = [entry.latt, entry.longt];
                let listOfMarkers = L.marker(latLong).addTo(this.mymap);
                const popup = L.popup().setContent('<b>Branch Name: ' + entry.name + '<br>Current Operation: ' + entry.opens + '-' + entry.closes + '<br>Queue Length: ' + entry.queueLength + '</b><br><button id="btn-' + entry.id + '" type="button" class="btn-primary col-sm" style="min-width: 100px; max-width: 100px"">Join Queue</button>').setLatLng(latLong);
                this.mymap.openPopup(popup);
                const buttonSubmit = L.DomUtil.get('btn-' + entry.id);
                L.DomEvent.addListener(buttonSubmit, 'click', (ee: any) => {
                  this.addQueue(entry.id);
                });
                listOfMarkers.bindPopup(popup);
              }
            }
          } else {
            console.log('No Search GP');
          }
        });
    }
  }

  searchFilter() {
    console.log('searchFilter');
    if (this.district !== undefined && this.mGroup !== undefined) {
      this.smartSearchService.searchByDistrictOrMGroup({clinicId: this.mGroup, district: this.district}).subscribe(
        data => {
          console.log(data);
          if (data !== null && data !== 'ERROR') {
            // @ts-ignore
            this.filterList = data.data;
            // @ts-ignore
            if (data.error !== undefined && data.error !== null && data.error !== '') {
              alert('No Clinic Available');
            } else {
              for (let entry of this.filterList) {
                console.log('latt: ' + entry.latt + ', longt: ' + entry.longt);
                if (entry.latt !== null  && entry.longt !== null) {
                  const latLong = [entry.latt, entry.longt];
                  let listOfMarkers = L.marker(latLong).addTo(this.mymap);
                  // listOfMarkers.bindPopup('<b>Branch Name: ' + entry.name + '<br>Current Operation: ' + entry.opens + '-' + entry.closes + '<br>Queue Length: ' + entry.queueLength + '</b><br><button id="btn-' + entry.id + '" type="button" class="btn-primary col-sm" style="min-width: 100px; max-width: 100px" (click)="addQueue(' + entry.id + ')">Join Queue</button>');
                  const popup = L.popup().setContent('<b>Branch Name: ' + entry.branchName + '<br>Current Operation: ' + entry.opens + '-' + entry.closes + '<br>Queue Length: ' + entry.queueLength + '</b><br><button id="btn-' + entry.branchId + '" type="button" class="btn-primary col-sm" style="min-width: 100px; max-width: 100px"">Join Queue</button>').setLatLng(latLong);
                  this.mymap.openPopup(popup);
                  const buttonSubmit = L.DomUtil.get('btn-' + entry.branchId);
                  L.DomEvent.addListener(buttonSubmit, 'click', (ee: any) => {
                    this.addQueue(entry.branchId);
                  });
                  listOfMarkers.bindPopup(popup);
                }
              }
            }
          } else {
            console.log('No Search Filter');
          }
        });
    }
  }

  addQueue(branchId: any) {
    console.log('addQueue - branchId:');
    console.log(branchId);
    this.branchId = branchId;
    if (this.branchId !== null && this.branchId !== '' && this.branchId !== undefined) {
      GlobalConstants.branchId = this.branchId;
      this.router.navigate(['/patient-login']);
    }
  }

  login() {
    this.router.navigate(['/patient-login']);
  }
}
