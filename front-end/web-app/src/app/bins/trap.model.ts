import { Record } from './record.model';
export class Trap {
	public map: Map<string, number>;
	public name: string;
	public record_number: number;
	public records: Record[];

	constructor(name: string) {
		this.name = name;
		this.record_number = 0;
		this.map = new Map();
		this.records = new Array();
	}

	addRecord(record : Record) {
		this.records.push(record);
		this.map.set(record.timestamp, this.records.length - 1);
		this.record_number++;
	}
}