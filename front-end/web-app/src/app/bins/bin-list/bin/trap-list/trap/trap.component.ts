import { Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import { Trap } from '../../../../trap.model';

@Component({
  selector: 'app-trap',
  templateUrl: './trap.component.html',
  styleUrls: ['./trap.component.css']
})
export class TrapComponent implements OnInit {
	@ViewChild('trapId') el:ElementRef;
	@Input() trap: Trap;
  	@Input() binIndex: number;
  	@Input() trapIndex: number;
  constructor() { }

  ngOnInit() {
  	const count = this.trap.records[this.trap.records.length - 1].insectCount;
  	if (count < 4) {
  		this.el.nativeElement.style.background = 'green';
  	} else if (count < 7) {
  		this.el.nativeElement.style.background = 'yellow';
  	} else {
  		this.el.nativeElement.style.background = 'red';
  	}
  }

}
