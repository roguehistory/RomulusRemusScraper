import {
  Injectable
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import {
  Observable
} from 'rxjs';

export interface Message {
  fromName: string;
  subject: string;
  date: string;
  id: number;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  DATA:any;

  constructor(private http: HttpClient) {
    this.getJSON().subscribe(data => {
      console.log(data);
    });
  }

  async fetchJSON(): Promise<Observable<any>> {
    return this.DATA;
  }
  public getJSON(): Observable < any > {
    this.DATA = this.http.get("../../assets/data/DATA.json");
    return this.DATA
  }

  public getJSONbyID(id): Observable < any > {
    return this.http.get("../../assets/data/video-comments/"+id+".json");
  }

  public processCSV() {
    console.log("Process CSV....")
    return this.http.get("http://localhost:4201/processCSV");
  }
}
