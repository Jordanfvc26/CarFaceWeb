import { environment } from './../../../environments/environment';
import { RegisterChoferI } from './../interfaces/chofer.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChoferService {

  constructor(private _httpClient: HttpClient) { }

  //Consumo de servicio para registrar un chofer
  registerChofer(body: RegisterChoferI): Observable<any> {
    return this._httpClient.post(`${environment.urlApi}/chofer`, body);
  }

  //Consumo de servicio para listar a los choferes
  listarChoferes(): Observable<any> {
    return this._httpClient.get(`${environment.urlApi}/chofer`);
  }

}
