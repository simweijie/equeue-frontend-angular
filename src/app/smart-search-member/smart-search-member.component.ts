import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SmartSearchService} from '../shared/services/smart-search.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {CommonService} from '../shared/services/common.service';
import {GlobalConstants} from "../shared/global-constants";

declare  const L: any;

@Component({
  selector: 'app-smart-search-member',
  templateUrl: './smart-search-member.component.html',
  styleUrls: ['./smart-search-member.component.css']
})
export class SmartSearchMemberComponent implements OnInit {

  modalChangeRef: BsModalRef;
  @ViewChild('changeConfirmation') modalChange: TemplateRef<any>;

  modalNewRef: BsModalRef;
  @ViewChild('newConfirmation') modalNew: TemplateRef<any>;

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
  patientId: any;
  private state: string | null;
  headerName: any;
  output: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private smartSearchService: SmartSearchService,
    private modalService: BsModalService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.getPatientId();
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
      this.smartSearchService.searchByGP({latt: this.curLat, longt: this.curLong}).subscribe(
        data => {
          console.log(data);
          if (data !== null || data !== 'ERROR') {
            // @ts-ignore
            this.filterList = data.data;
            for (let entry of this.filterList) {
              console.log('latt: ' + entry.latt + ', longt: ' + entry.longt);
              if (entry.latt !== null  && entry.longt !== null) {
                const latLong = [entry.latt, entry.longt];
                let listOfMarkers = L.marker(latLong).addTo(this.mymap);
                if (this.state === 'C') {
                  listOfMarkers.bindPopup('<b>Branch Name: {{entry.branchName}}} <br> Current Operation: {{entry.opens}} - {{entry.closes}} <br> Queue Length: {{entry.queueLength}}</b><br><button class="btn-primary col-sm-1" (click)="changeConfirmation(entry.branchId)">Join Queue</button>');
                } else if (this.state === 'N') {
                  listOfMarkers.bindPopup('<b>Branch Name: {{entry.branchName}}} <br> Current Operation: {{entry.opens}} - {{entry.closes}} <br> Queue Length: {{entry.queueLength}}</b><br><button class="btn-primary col-sm-1" (click)="newConfirmation(entry.branchId)">Join Queue</button>');
                }
              }
            }
          } else {

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
      this.smartSearchService.searchByDistrictOrMGroup({clinicId: this.mGroup, district: this.district}).subscribe(
        data => {
          console.log(data);
          if (data !== null || data !== 'ERROR') {
            // @ts-ignore
            this.filterList = data.data;
            for (let entry of this.filterList) {
              console.log('latt: ' + entry.latt + ', longt: ' + entry.longt);
              if (entry.latt !== null  && entry.longt !== null) {
                const latLong = [entry.latt, entry.longt];
                let listOfMarkers = L.marker(latLong).addTo(this.mymap);
                if(this.state === 'C') {
                  listOfMarkers.bindPopup('<b>Branch Name: {{entry.branchName}}} <br> Current Operation: {{entry.opens}} - {{entry.closes}} <br> Queue Length: {{entry.queueLength}}</b><br><button class="btn-primary col-sm-1" (click)="changeConfirmation(entry.branchId)">Join Queue</button>');
                } else if (this.state === 'N') {
                  listOfMarkers.bindPopup('<b>Branch Name: {{entry.branchName}}} <br> Current Operation: {{entry.opens}} - {{entry.closes}} <br> Queue Length: {{entry.queueLength}}</b><br><button class="btn-primary col-sm-1" (click)="newConfirmation(entry.branchId)">Join Queue</button>');
                }
              }
            }
          }
        });
    }
  }

  getPatientId() {
    // this.activatedRoute.queryParams.subscribe(params => {
    //   this.adminId = params['adminId'];
    // });
    this.patientId = GlobalConstants.login.id;
    this.state = GlobalConstants.serachType;
    console.log('getPatientId - patientId:');
    console.log(this.patientId);
    console.log(this.state);
    if (this.state === 'N') {
      this.headerName = 'Get Queue No';
    } else {
      this.headerName = 'Change Clinic';
    }
  }

  changeConfirmation(branchId: any) {
    this.branchId = branchId;
    this.modalChangeRef = this.modalService.show(this.modalChange);
  }

  newConfirmation(branchId: any) {
    this.branchId = branchId;
    this.modalNewRef = this.modalService.show(this.modalNew);
  }

  changeQueue() {
    console.log('addQueue - branchId:');
    console.log(this.branchId);
    if ((this.branchId !== null || this.branchId !== '') && (this.patientId !== null || this.patientId !== '')) {
      this.smartSearchService.leaveQueue({branchId: this.branchId, customerId: this.patientId}).subscribe(
        data => {
          console.log(data);
          if (data === 'SUCCESS') {
            this.newQueue();
          } else {
            alert('Unable to join the queue. Please refresh page or try again later!');
            this.decline();
          }
        });
    }
  }

  newQueue() {
    console.log('addQueue - branchId:');
    console.log(this.branchId);
    if ((this.branchId !== null || this.branchId !== '') && (this.patientId !== null || this.patientId !== '')) {
      this.smartSearchService.joinQueue({branchId: this.branchId, customerId: this.patientId}).subscribe(
        data => {
          console.log(data);
          this.output = data;
          if (this.output === '') {
            console.log('Successfully Joined');
            window.history.back();
          } else if (this.output.error !== '') {
            alert(this.output.error);
          } else {
            alert('Unable to join the queue. Please refresh page or try again later!');
          }
          this.decline();
        });
    }
  }

  decline() {
    this.modalChangeRef.hide();
    this.modalNewRef.hide();
    this.branchId = '';
  }
}
