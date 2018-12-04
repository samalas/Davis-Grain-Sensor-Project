import { Bin } from './bin.model';
import { Trap } from './trap.model';
import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { ServerService } from '../server.service';
import { Record } from './record.model';
import * as moment from 'moment';

@Injectable()
export class BinService implements OnInit {
	private bins: Bin[];
	private map : Map<string, number>; 
	constructor(private serverService : ServerService) {
		this.map = new Map();
		this.bins = new Array();
	}

	ngOnInit() {
		// this.serverService.getActiveSensor()
		// 	.subscribe(
		// 		(response) => console.log(response),
		// 		(error) => console.log(error)
		// 	);
  	}
  	
	getBins() {
		return this.bins.slice();
	}

	getMap() {
		return this.map;
	}

	getBin(location:string) {
		return this.bins[this.map.get(location)];
	}

	addRecords(record : any) {
		const timestamp = moment.utc(record.timestamp).local().format('MM/DD/YYYY, h:mm a');
		const newUnixTimeStamp = moment.utc(record.timestamp).local().valueOf();
		//console.log(moment.utc('2018-06-22T04:59:41.776Z').local().format('MM/DD/YYYY, h:mm a'));
		if (!this.map.has(record.sensorLocation)) {
			this.bins.push(new Bin(record.sensorLocation, "https://www.quickanddirtytips.com/sites/default/files/images/5360/line_graph.png"));
			this.map.set(record.sensorLocation, this.bins.length - 1);
		}
		if (!this.bins[this.map.get(record.sensorLocation)].map.has(record.sensorID)) {
			this.bins[this.map.get(record.sensorLocation)].addTrap(new Trap(record.sensorID));
		}
		var bin : Bin = this.bins[this.map.get(record.sensorLocation)];
		var trap : Trap = bin.trap_list[bin.map.get(record.sensorID)];
		if (!trap.map.has(timestamp)) {
			trap.addRecord(new Record(record.sensorLocation, record.sensorID, record.insectCount, timestamp, record.imgUrl, newUnixTimeStamp, record.timestamp));
		}
	}
}

//[new Trap("trap " + record.sensorID)]

// new Bin('Bin1', 9, 'https://www.quickanddirtytips.com/sites/default/files/images/5360/line_graph.png', [new Trap('trap1', 3),new Trap('trap2', 6),new Trap('trap3', 4),new Trap('trap4', 9)]),
// 	new Bin('Bin2', 6, 'https://www.quickanddirtytips.com/sites/default/files/images/5383/two_line_graph.png', [new Trap('trap1', 3),new Trap('trap2', 6),new Trap('trap3', 4),new Trap('trap4', 9)]),