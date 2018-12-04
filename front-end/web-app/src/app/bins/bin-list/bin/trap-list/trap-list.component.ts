import { Component, OnInit, Input } from '@angular/core';
import { Trap } from '../../../trap.model';

@Component({
  selector: 'app-trap-list',
  templateUrl: './trap-list.component.html',
  styleUrls: ['./trap-list.component.css']
})
export class TrapListComponent implements OnInit {
	@Input() traps: Trap[];
	@Input() binIndex1: number;
  constructor() { }

  ngOnInit() {
  }

}
