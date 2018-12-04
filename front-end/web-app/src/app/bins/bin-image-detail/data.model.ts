export class Data {
	public map: Map<string, number>;
	public label: string;
	//public xValueType: string;
	//public backgroundColor: string;
	public borderColor: string;
	public data: any[];
	public fill: boolean;
	public showLine: boolean;

	constructor(label: string, color: string) {
		//this.xValueType = "dateTime";
		this.label = label;
		//this.backgroundColor = color;
		this.borderColor = color;
		this.map = new Map();
		this.data = new Array();
		this.fill = false;
		this.showLine = true;
	}

	public addPoint(point : any) {
		if (!this.map.has(point.x)) {
			this.data.push(point);
			this.map.set(point.x, point.y);
		}
	}
}