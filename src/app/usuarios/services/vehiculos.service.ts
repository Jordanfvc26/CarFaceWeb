import { environment } from '../../../environments/environment';
import { RegisterVehiculoI } from './../interfaces/vehiculo.interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {

  constructor(private _httpClient: HttpClient) { }

  //Consumo de servicio para registrar un vehículo
  registerVehiculo(body: RegisterVehiculoI): Observable<any> {
    return this._httpClient.post(`${environment.urlApi}/vehiculo`, body);
  }

  //Consumo de servicio para listar a los vehículos
  listarVehiculos(): Observable<any> {
    return this._httpClient.get(`${environment.urlApi}/vehiculo`);
  }

}
