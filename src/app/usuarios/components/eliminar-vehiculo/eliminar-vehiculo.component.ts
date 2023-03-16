import { Alerts } from './../../alerts/alerts.component';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
/*Para los íconos*/
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-eliminar-vehiculo',
  templateUrl: './eliminar-vehiculo.component.html',
  styleUrls: ['./eliminar-vehiculo.component.css']
})
export class EliminarVehiculoComponent implements OnInit {

  //Variables y objectos a utilizar
  static objectVehiculo = {
    id: "",
    tipoVehiculo: "",
    marca: "",
    modelo: "",
    placa: "",
    anio: "",
    color: "",
  };
  estadoSpinner = false;

  constructor(
    public modal: NgbModal,
    private api: ConsumirServiciosService,
    public alertaEmergente: Alerts
  ) { }

  ngOnInit(): void {
    this.estadoSpinner = true;
  }


  //Método que elimina un vehículo
  eliminarVehiculo() {
    this.estadoSpinner = false;
    this.api.deleteDatos("/vehiculo/" + EliminarVehiculoComponent.objectVehiculo.id + "/0").subscribe(data => {
      this.estadoSpinner = true;
      this.alertaEmergente.alertaOKConReload("Vehículo eliminado correctamente");
      this.modal.dismissAll()
    }, error =>{
      this.estadoSpinner = true;
      this.alertaEmergente.alertaOKConReload("Vehículo eliminado correctamente");
    });
  }

  //Iconos a utilizar
  iconCancelar = iconos.faBan;
  iconEliminar = iconos.faTrash;
  iconAceptar = iconos.faCheck;
}
