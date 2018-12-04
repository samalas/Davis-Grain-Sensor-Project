import { Injectable} from '@angular/core';
import { Http, Response} from '@angular/http';
import { Router} from '@angular/router';

@Injectable()
export class AuthService {
	private token: string;

	constructor(private router: Router, private http : Http) {}

	signinUser() {
		this.http.get('https://127.0.0.1/auth/login')
		.subscribe(
			(response: Response) => {
				console.log(response);
			}
		);
	}
}