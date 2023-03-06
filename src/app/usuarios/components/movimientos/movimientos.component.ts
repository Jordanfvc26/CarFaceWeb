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
  opciones: any;

  constructor(
    private api: ConsumirServiciosService,
    public alertaEmergente: Alerts,
    private ruta: Router,
  ) { }

  ngOnInit(): void {
    let headers = new Map();
    this.api.getDatos("/chofer").subscribe(data => {
      data.chofer.vehiculo.forEach(element => {
        element.registros.forEach(element2 => {

          const fechatTemp = element2.fecha;
          const fecha = new Date(fechatTemp);
          //Dando formato a la fecha
          this.opciones = { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          };
          const fechaFormateada = fecha.toLocaleString('es-ES', this.opciones);

          let vehiculo = {
            "marca": element.marca,
            "modelo": element.modelo,
            "color": element.color,
            "placa": element.placa,
            "fecha": fechaFormateada,
            "tipo": element2.tipo
          }
          //Agregando los datos finaes al vector
          this.movimientos.push(vehiculo);
        });
      });

    }, error => {
      console.log(error);
      this.alertaEmergente.alertMensajeError("No se pudieron cargar los recursos :(");
    })
  }

}
