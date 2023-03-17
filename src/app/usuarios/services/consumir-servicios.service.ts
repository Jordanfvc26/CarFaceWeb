import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http'
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ConsumirServiciosService {

  correo = '';
  clave = '';
  url: string = environment.urlApi
  token = sessionStorage.getItem("usuario");
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.token,
    'Accept': '*/*',
    'Access-Control-Request-Header':'Content-type',
    'Access-Control-Allow-Origin': '*'
  });

  options = {}

  constructor(
    private http: HttpClient,
    private ruta: Router) { 
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

  //Interceptando el error 403 por si caduca el token y se redirige al incio de sesión
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          sessionStorage.clear();
          this.ruta.navigate(['/login']);
          window.location.reload();
        }
        return throwError(error);
      })
    );
  }
}
