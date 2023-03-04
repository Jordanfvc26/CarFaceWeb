import { Router } from '@angular/router';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { Alerts } from './../../alerts/alerts.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})
export class MovimientosComponent implements OnInit {

  movimientos: any[] = [];

  constructor(
    private api: ConsumirServiciosService,
    public alertaEmergente: Alerts,
    private ruta:Router,
  ) { }

  ngOnInit(): void {
    let headers = new Map();
    this.api.getDatos("/chofer").subscribe(data=>{
      data.chofer.vehiculo.forEach(element => {
         element.registros.forEach(element2 => {
          let vehiculo = {
            "id":element.id,
            "placa":element.placa,
            "fecha": element2.fecha,
            "tipo": element2.tipo
          }
          this.movimientos.push(vehiculo);
         });
      });

    }, error =>{
      console.log(error);
      this.alertaEmergente.alertMensajeError("No se pudieron cargar los recursos :(");
    })
  }

}
