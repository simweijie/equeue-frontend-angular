import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {SmartSearchService} from '../shared/services/smart-search.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {CommonService} from '../shared/services/common.service';
import {GlobalConstants} from "../shared/global-constants";
import {Login} from "../shared/modals/login.modal";

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
  zoomLvl = 11;
  mGroup: any;
  district: any;
  // pCode: any;
  mGroupList: any;
  curLat = 0;
  curLong = 0;
  markerList: any;

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
  login: Login;
  greenIcon: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private smartSearchService: SmartSearchService,
    private modalService: BsModalService,
    private commonService: CommonService
  ) {
    this.login = new Login();
    this.markerList = [];
  }

  ngOnInit(): void {
    this.getInfo();
    this.getState();
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
      this.greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
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

  getInfo() {
    console.log('getInfo - job:');
    if (GlobalConstants.login === undefined) {
      this.login = new Login();
    } else {
      this.login = GlobalConstants.login;
    }
    console.log('this.login: ');
    console.log(this.login);
    console.log('GlobalConstants.login: ');
    console.log(GlobalConstants.login);
    if (GlobalConstants.login.id === null || GlobalConstants.login.id === undefined || GlobalConstants.login.id === '') {
      this.router.navigate(['/patient-login']);
    } else {
      this.patientId = GlobalConstants.login.id;
    }
  }

  logout() {
    if (this.login.id !== '') {
      // this.commonService.logout({id: this.login.id}).subscribe(
      //   data => {
      //     console.log('1' + data);
      //     if (data === 'SUCCESS') {
      //       console.log('2' + data);
      //       this.router.navigate(['/']);
      //     } else {
      //       this.router.navigate(['/']);
      //     }
      //     GlobalConstants.login = new Login();
      //     GlobalConstants.clinicId = '';
      //   });
      this.router.navigate(['/']);
      GlobalConstants.login = new Login();
      GlobalConstants.clinicId = '';
    }
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
        this.greenIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
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
              if (this.state === 'C') {
                listOfMarkers.bindPopup('<b>Branch Name: ' + entry.name + '<br>Current Operation: ' + entry.opens + '-' + entry.closes + '<br>Queue Length: ' + entry.queueLength + '</b><br><button id="btn-' + entry.id + '" type="button" class="btn-primary col-sm" style="min-width: 100px; max-width: 100px" (click)="changeConfirmation(' + entry.id + ')">Join Queue</button>');
              } else if (this.state === 'N') {
                listOfMarkers.bindPopup('<b>Branch Name: ' + entry.name + '<br>Current Operation: ' + entry.opens + '-' + entry.closes + '<br>Queue Length: ' + entry.queueLength + '</b><br><button id="btn-' + entry.id + '" type="button" class="btn-primary col-sm" style="min-width: 100px; max-width: 100px" (click)="newConfirmation(' + entry.id + ')">Join Queue</button>');
              }
              this.markerList.push(listOfMarkers);
              // const popup = L.popup().setContent('<b>Branch Name: ' + entry.name + '<br>Current Operation: ' + entry.opens + '-' + entry.closes + '<br>Queue Length: ' + entry.queueLength + '</b><br><button id="btn-' + entry.id + '" type="button" class="btn-primary col-sm" style="min-width: 100px; max-width: 100px"">Join Queue</button>').setLatLng(latLong);
              // this.mymap.openPopup(popup);
              // const buttonSubmit = L.DomUtil.get('btn-' + entry.id);
              // L.DomEvent.addListener(buttonSubmit, 'click', (ee: any) => {
              //   if(this.state === 'C') {
              //     this.changeConfirmation(entry.id);
              //   } else if (this.state === 'N') {
              //     this.newConfirmation(entry.id);
              //   }
              // });
              // listOfMarkers.bindPopup(popup);
            }
          }
        } else {
          console.log('No listOfBranches');
        }
      });
  }

  searchGP() {
    console.log('searchGp');
    if (this.curLat !== 0 && this.curLong !== 0) {
      this.smartSearchService.searchByGP({latt: this.curLat, longt: this.curLong}).subscribe(
        data => {
          console.log(data);
          this.removeMarker();
          if (data !== null && data !== 'ERROR') {
            // @ts-ignore
            this.filterList = data.data;
            for (let entry of this.filterList) {
              console.log('latt: ' + entry.latt + ', longt: ' + entry.longt);
              if (entry.latt !== null  && entry.longt !== null) {
                const latLong = [entry.latt, entry.longt];
                let listOfMarkers = L.marker(latLong).addTo(this.mymap);
                // if (this.state === 'C') {
                //   listOfMarkers.bindPopup('<b>Branch Name: ' + entry.name + '<br>Current Operation: ' + entry.opens + '-' + entry.closes + '<br>Queue Length: ' + entry.queueLength + '</b><br><button id="btn-' + entry.id + '" type="button" class="btn-primary col-sm" style="min-width: 100px; max-width: 100px" (click)="changeConfirmation(' + entry.id + ')">Join Queue</button>');
                // } else if (this.state === 'N') {
                //   listOfMarkers.bindPopup('<b>Branch Name: ' + entry.name + '<br>Current Operation: ' + entry.opens + '-' + entry.closes + '<br>Queue Length: ' + entry.queueLength + '</b><br><button id="btn-' + entry.id + '" type="button" class="btn-primary col-sm" style="min-width: 100px; max-width: 100px" (click)="newConfirmation(' + entry.id + ')">Join Queue</button>');
                // }
                const popup = L.popup().setContent('<b>Branch Name: ' + entry.name + '<br>Current Operation: ' + entry.opens + '-' + entry.closes + '<br>Queue Length: ' + entry.queueLength + '</b><br><button id="btn-' + entry.id + '" type="button" class="btn-primary col-sm" style="min-width: 100px; max-width: 100px"">Join Queue</button>').setLatLng(latLong);
                this.mymap.openPopup(popup);
                const buttonSubmit = L.DomUtil.get('btn-' + entry.id);
                L.DomEvent.addListener(buttonSubmit, 'click', (ee: any) => {
                  if(this.state === 'C') {
                    this.changeConfirmation(entry.id);
                  } else if (this.state === 'N') {
                    this.newConfirmation(entry.id);
                  }
                });
                listOfMarkers.bindPopup(popup);
                this.markerList.push(listOfMarkers);
              }
            }
          } else {
            this.listOfBranches();
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
          this.removeMarker();
          if (data !== null && data !== 'ERROR') {
            // @ts-ignore
            this.filterList = data.data;
            // @ts-ignore
            if (data.error !== undefined && data.error !== null && data.error !== '') {
              alert('No Clinic Available');
              this.listOfBranches();
            } else {
              for (let entry of this.filterList) {
                console.log('latt: ' + entry.latt + ', longt: ' + entry.longt);
                if (entry.latt !== null  && entry.longt !== null) {
                  const latLong = [entry.latt, entry.longt];
                  let listOfMarkers = L.marker(latLong).addTo(this.mymap);
                  // if(this.state === 'C') {
                  //   listOfMarkers.bindPopup('<b>Branch Name: ' + entry.name + '<br>Current Operation: ' + entry.opens + '-' + entry.closes + '<br>Queue Length: ' + entry.queueLength + '</b><br><button id="btn-' + entry.id + '" type="button" class="btn-primary col-sm" style="min-width: 100px; max-width: 100px" (click)="changeConfirmation(' + entry.id + ')">Join Queue</button>');
                  // } else if (this.state === 'N') {
                  //   listOfMarkers.bindPopup('<b>Branch Name: ' + entry.name + '<br>Current Operation: ' + entry.opens + '-' + entry.closes + '<br>Queue Length: ' + entry.queueLength + '</b><br><button id="btn-' + entry.id + '" type="button" class="btn-primary col-sm" style="min-width: 100px; max-width: 100px" (click)="newConfirmation(' + entry.id + ')">Join Queue</button>');
                  // }
                  const popup = L.popup().setContent('<b>Branch Name: ' + entry.branchName + '<br>Current Operation: ' + entry.opens + '-' + entry.closes + '<br>Queue Length: ' + entry.queueLength + '</b><br><button id="btn-' + entry.branchId + '" type="button" class="btn-primary col-sm" style="min-width: 100px; max-width: 100px"">Join Queue</button>').setLatLng(latLong);
                  this.mymap.openPopup(popup);
                  const buttonSubmit = L.DomUtil.get('btn-' + entry.branchId);
                  L.DomEvent.addListener(buttonSubmit, 'click', (ee: any) => {
                    if(this.state === 'C') {
                      this.changeConfirmation(entry.branchId);
                    } else if (this.state === 'N') {
                      this.newConfirmation(entry.branchId);
                    }
                  });
                  listOfMarkers.bindPopup(popup);
                  this.markerList.push(listOfMarkers);
                }
              }
            }
          } else {
            this.listOfBranches();
            console.log('No Search Filter');
          }
        });
    }
  }

  getState() {
    this.state = GlobalConstants.serachType;
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
    console.log('changeQueue - branchId:');
    console.log(this.branchId);
    if (this.branchId !== null && this.branchId !== '' && this.branchId !== undefined
      && this.patientId !== null && this.patientId !== '' && this.patientId !== undefined) {
      console.log('changeQueue - inside:');
      this.smartSearchService.leaveQueue({branchId: this.branchId, customerId: this.patientId}).subscribe(
        data => {
          console.log(data);
          if (data === 'SUCCESS') {
            console.log('SUCCESS');
            this.newQueue('C');
          } else {
            alert('Unable to join the queue. Please refresh page or try again later!');
            this.declineChange();
          }
        });
    }
  }

  newQueue(type: any) {
    console.log('addQueue - branchId:');
    console.log(this.branchId);
    console.log(this.patientId);
    if (this.branchId !== null && this.branchId !== '' && this.branchId !== undefined
      && this.patientId !== null && this.patientId !== '' && this.patientId !== undefined) {
      console.log('addQueue - inside:');
      this.smartSearchService.joinQueue({branchId: this.branchId, customerId: this.patientId}).subscribe(
        data => {
          console.log(data);
          // @ts-ignore
          this.output = data.data;
          console.log('this.output: ' + this.output);
          if (this.output === '{}') {
            console.log('Successfully Joined');
            this.router.navigate(['/patient-view-details']);
          } else if (this.output.error !== '') {
            alert(this.output.error);
          } else {
            alert('Unable to join the queue. Please refresh page or try again later!');
          }
          if (type === 'C') {
            this.declineChange();
          } else {
            this.decline();
          }
        });
    }
  }

  declineChange() {
    this.modalChangeRef.hide();
    this.branchId = '';
  }

  decline() {
    this.modalNewRef.hide();
    this.branchId = '';
  }

  removeMarker() {
    for(let entry of this.markerList) {
      this.mymap.removeLayer(entry);
    }
  }
}
