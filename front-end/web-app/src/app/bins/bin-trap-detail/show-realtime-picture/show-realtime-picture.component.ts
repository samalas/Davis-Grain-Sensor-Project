import { Component, OnInit, Input } from '@angular/core';
import { Record } from '../../record.model';

@Component({
  selector: 'app-show-realtime-picture',
  templateUrl: './show-realtime-picture.component.html',
  styleUrls: ['./show-realtime-picture.component.css']
})
export class ShowRealtimePictureComponent implements OnInit {
	@Input() record : Record;
  constructor() { }

  ngOnInit() {
  }

}
