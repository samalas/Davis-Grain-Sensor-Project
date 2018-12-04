export class Record {
	public sensorLocation: string;
	public sensorID: number;
	public insectCount: number;
	public timestamp: string;
	public imgUrl: string;
	public newUnixTimeStamp: number;
	public utc_time: string;

	constructor(sL: string, sI: number, insect_number: number, time_stamp: string, imgUrl: string, newUnixTimeStamp : number, utc : string) {
		this.sensorLocation = sL;
		this.sensorID = sI;
		this.insectCount = insect_number;
		this.timestamp = time_stamp;
		this.imgUrl = imgUrl;
		this.newUnixTimeStamp = newUnixTimeStamp;
		this.utc_time = utc;
	}
}