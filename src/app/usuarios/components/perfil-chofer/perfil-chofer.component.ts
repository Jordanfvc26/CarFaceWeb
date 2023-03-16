import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Alerts } from './../../alerts/alerts.component';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { EditarChoferComponent } from '../editar-chofer/editar-chofer.component';

@Component({
  selector: 'app-perfil-chofer',
  templateUrl: './perfil-chofer.component.html',
  styleUrls: ['./perfil-chofer.component.css']
})
export class PerfilChoferComponent implements OnInit {

  estadoSpinner = false;
  chofer: any;

  constructor(
    private ruta: Router,
    private api: ConsumirServiciosService,
    public alertaEmergente: Alerts,
    public modal: NgbModal) { }


  ngOnInit(): void {
    this.estadoSpinner = false;
    this.api.getDatos("/chofer").subscribe(data => {

      this.chofer = {
        "id": data.id,
        "ci": data.ci,
        "nombre": data.nombre,
        "apellido": data.apellido,
        "nombreCompleto": data.nombre + " " + data.apellido,
        "telefono": data.telefono,
        "direccion": data.direccion,
        "licencia": "A"
      }
      this.estadoSpinner = true;


    }, error => {
      this.alertaEmergente.alertaErrorSinReloadBtn("No se ha podido cargae la información");
      this.estadoSpinner = true;
    });
  }


  //Método que abre el modal para editar el chofer
  abrirModalEditarGuardia(modalChofer, chofer) {
    this.modal.open(modalChofer, { size: 'lg', centered: true });
    EditarChoferComponent.objectChofer = chofer;
  }
}
