import { EventEmitter} from '@angular/core';
export class SettingService {
	private greenLine : number;
	private redLine : number;
	private dates : string[];
	private time : string;
	private span : string;

	constructor() {
		this.dates = new Array();
	}
	getGL() {
		return this.greenLine;
	}
	setGL(index : number) {
		this.greenLine = index;
		console.log(this.greenLine);
	}

	getRL() {
		return this.redLine;
	}

	setRL(index : number) {
		this.redLine = index;
		console.log(this.redLine);
	}

	getDates() {
		return this.dates.slice();
	}

	getTime() {
		return this.time;
	}

	getSpan() {
		return this.span;
	}

	setDates(dates: string[]) {
		while (this.dates.length > 0) {
			this.dates.pop();
		}
		for (let date of dates) {
			this.dates.push(date);
		}
		console.log(this.dates);
	}

	setTime(time : string) {
		this.time = time;
		console.log(this.time);
	}

	setSpan(span : string) {
		this.span = span;
		console.log(this.span);
	}

}