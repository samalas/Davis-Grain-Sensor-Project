import { Trap } from './trap.model';
export class Bin {
	public map: Map<string, number>;
	public name: string;
	public trap_number: number;
	public graph: string;
	public trap_list: Trap[];

	constructor(name: string, graph: string) {
		this.name = name;
		this.trap_number = 0;
		this.graph = graph;
		this.map = new Map();
		this.trap_list = new Array();
	}

	addTrap(trap : Trap) {
		this.trap_list.push(trap);
		this.map.set(trap.name, this.trap_list.length - 1);
		this.trap_number++;
	}
}