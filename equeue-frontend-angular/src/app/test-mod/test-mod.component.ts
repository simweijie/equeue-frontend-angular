import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TestModService} from '../shared/services/test-mod.service';

@Component({
  selector: 'app-test-mod',
  templateUrl: './test-mod.component.html',
  styleUrls: ['./test-mod.component.css']
})
export class TestModComponent implements OnInit {

  output: any;

  constructor(
    private route: ActivatedRoute,
    private testModService: TestModService) { }

  ngOnInit() {
  }

  testPost() {
    // Call the service and send to the backend
    console.log('Inside testPost statement');

    this.testModService.testPost({pVal: 'Hi'}).subscribe(data => {
      if (data === 'ERROR') {
        this.output = 'Hello';
      } else {
        this.output = data;
      }
    });
  }
}
