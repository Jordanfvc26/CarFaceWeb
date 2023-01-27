import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ConsumirServiciosService {

  correo = '';
  clave = ''; 
  url: string = "http://localhost:8080"
  token = localStorage.getItem("usuario");
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'bearer ' + this.token,
    'correo': this.correo,
    'clave': this.clave,
  });
  
  options = { headers: this.headers }

  constructor(private http: HttpClient) { }

  //Iniciar sesion
  getDatos(rutaComplementaria: String): Observable<any> {
    return this.http.get(this.url + rutaComplementaria);
  }

  postDatos(rutaComplementaria: String, body:any, correo:any, clave:any): Observable<any>{
    this.correo = correo;
    this.clave = clave;
    return this.http.post(this.url + rutaComplementaria, body);
  }
}
