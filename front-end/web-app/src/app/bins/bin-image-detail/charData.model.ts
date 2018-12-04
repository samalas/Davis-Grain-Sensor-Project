import { Record } from '../record.model';
export class CharData {
	public label: string;
	public backgroundColor: string;
	public borderColor: string;
	public borderWidth: number;
	public data: number[];
	public set: Set<string>;
	constructor(label: string, color: string) {
		this.label = label;
		this.backgroundColor = color;
		this.borderColor = color;
		this.borderWidth = 1;
		this.data = new Array();
		this.set = new Set();
	}

	addData(record : Record) {
		const time = record.timestamp.substring(0, 10);
		if (!this.set.has(time)) {
			this.set.add(time);
			this.data.push(record.insectCount);
		}
	}
}