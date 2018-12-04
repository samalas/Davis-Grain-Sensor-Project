import { Injectable} from '@angular/core';
import { Http, Response} from '@angular/http';
import { map, catchError} from 'rxjs/operators';
import { throwError, Observable, Subject} from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from '../environments/environment';
@Injectable()
export class ServerService {
  // private socket; // socket that connect to the socket.io server

	constructor(private http : Http) {
  }
  	getSensors() {
  		return this.http.get('https://54.193.12.115:443/api/getSensors')
  			.pipe(map(
  				(response : Response) => {
  					const data = response.json();
  					return data;
  				}
  			),
  			catchError((error : Response) => {
    			return throwError('error : Fail to connect server');
			})

  			);
  	}

    getAllRecords() {
      return this.http.get('https://54.193.12.115:443/api/insectRecordAll')
        .pipe(map(
          (response : Response) => {
            const data = response.json();
            return data;
          }
        ),
        catchError((error : Response) => {
          return throwError('error : Fail to connect server');
      })

        );
    }

    take_photo() {
      return this.http.get('https://54.193.12.115/auth/token');
    }
}