import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CargarFotosService {

  correo = '';
  clave = '';
  url: string = "http://100.25.162.10:8080"
  token = sessionStorage.getItem("usuario");
  headers = new HttpHeaders({
    'Authorization': 'Bearer ' + this.token,
    'Accept': '*/*',
    'Access-Control-Request-Header':'Content-type',
    'Access-Control-Allow-Origin': '*'
  });

  options = {}

  constructor(private http: HttpClient) { 
  }


  getDatos(rutaComplementaria: String, headers?: Map<string, any>): Observable<any> {
      this.obtenerHeader(headers);

    return this.http.get(this.url + rutaComplementaria, this.options);
  }

  postDatos(rutaComplementaria: String, body: any, headers?: Map<string, any>): Observable<any> {
      this.obtenerHeader(headers);

      console.log(this.options);
    return this.http.post(this.url + rutaComplementaria, body, this.options);
  }

  putDatos(rutaComplementaria: String, datos: any, headers?: Map<string, any>): Observable<any> {
      this.obtenerHeader(headers);

    return this.http.put(this.url + rutaComplementaria, datos, this.options);
  }

  deleteDatos(rutaComplementaria: String, headers?: Map<string, any>): Observable<any> {
      this.obtenerHeader(headers);

    return this.http.delete(this.url + rutaComplementaria, this.options);
  }

  private obtenerHeader(headers: Map<string, any> | undefined): boolean {
    if (headers != null) {
      for (let key of headers.keys()) {
        this.headers = this.headers.append(key, headers.get(key) || "");
      }
    }
    this.options = { headers: this.headers };
    return headers != null;
  }
}
