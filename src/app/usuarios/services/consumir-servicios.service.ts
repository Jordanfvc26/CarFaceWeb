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
    'Authorization': 'bearer ' + this.token
  });

  options = { headers: this.headers }

  constructor(private http: HttpClient) { }

  //Iniciar sesion
  getDatos(rutaComplementaria: String, headers?: Map<string, any>): Observable<any> {
    if (headers != null)
      this.obtenerHeader(headers);

    return this.http.get(this.url + rutaComplementaria, this.options);
  }

  postDatos(rutaComplementaria: String, body: any, headers?: Map<string, any>): Observable<any> {
    if (headers != null)
      this.obtenerHeader(headers);

      console.log(this.options);
    return this.http.post(this.url + rutaComplementaria, body, this.options);
  }

  putDatos(rutaComplementaria: String, datos: any, headers?: Map<string, any>): Observable<any> {
    if (headers != null)
      this.obtenerHeader(headers);

    return this.http.put(this.url + rutaComplementaria, datos, this.options);
  }

  deleteDatos(rutaComplementaria: String, headers?: Map<string, any>): Observable<any> {
    if (headers != null)
      this.obtenerHeader(headers);

    return this.http.delete(this.url + rutaComplementaria, this.options);
  }

  private obtenerHeader(headers: Map<string, any>): boolean {
    if (headers != null) {
      for (let key of headers.keys()) {
        console.log(key, headers.get(key))
        this.headers.append(key, headers.get(key) || "");
      }
      return true;
    }
    return false;
  }
}
