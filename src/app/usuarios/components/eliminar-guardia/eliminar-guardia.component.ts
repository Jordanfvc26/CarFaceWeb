import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { Alerts } from './../../alerts/alerts.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
/*Para los íconos*/
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-eliminar-guardia',
  templateUrl: './eliminar-guardia.component.html',
  styleUrls: ['./eliminar-guardia.component.css']
})
export class EliminarGuardiaComponent implements OnInit {

  //Variable para almacenar el guardia a eliminar
  static guardiaIDEliminar = 0;

  constructor(
    public modal: NgbModal,
    private api: ConsumirServiciosService,
    public alertaEmergente: Alerts
  ) { }

  ngOnInit(): void {
  }

  //Método que eliminará el guardia con toda su información, según el ID
  public eliminarGuardia() {
    this.api.putDatos("/guardia/" + EliminarGuardiaComponent.guardiaIDEliminar + "/true", EliminarGuardiaComponent.guardiaIDEliminar).subscribe(data => {
      this.alertaEmergente.alertaMensajeOK("Se ha cambiado el estado correctamente.")
    }, error =>{
      this.alertaEmergente.alertMensajeError("No se pudo procesar su consulta");
    })
    this.modal.dismissAll();
  }

  
  //Iconos a utilizar
  iconCancelar = iconos.faBan;
  iconEliminar = iconos.faTrash;
  iconAceptar = iconos.faCheck;

}
