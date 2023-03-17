import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { Alerts } from './../../alerts/alerts.component';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
/*Para los íconos*/
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-editar-vehiculo',
  templateUrl: './editar-vehiculo.component.html',
  styleUrls: ['./editar-vehiculo.component.css']
})
export class EditarVehiculoComponent implements OnInit {

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


  /*Form para editar los datos de un guardia*/
  formEditVehiculo = new FormGroup({});
  modelEditVehiculo: any = {};
  optionsEditVehiculo: FormlyFormOptions = {};
  fieldsEditVehiculo: FormlyFieldConfig[] = [
    {
      key: 'fields',
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-sm-12 col-md-12 col-lg-4',
          type: 'input',
          key: 'placa',
          defaultValue: '',
          props: {
            label: 'Placa:',
            required: true,
          },
        },
        {
          className: 'col-sm-12 col-md-12 col-lg-4',
          type: 'input',
          key: 'marca',
          defaultValue: '',
          props: {
            label: 'Marca:',
            required: true,
          },
        },
        {
          className: 'col-sm-12 col-md-12 col-lg-4',
          type: 'input',
          key: 'modelo',
          defaultValue: '',
          props: {
            label: 'Modelo:',
            required: true,
          },
        },
        {
          className: 'col-sm-12 col-md-12 col-lg-4',
          type: 'input',
          key: 'color',
          defaultValue: '',
          props: {
            label: 'Color:',
            required: true,
          },
        },
        {
          className: 'col-sm-12 col-md-12 col-lg-4',
          type: 'input',
          key: 'año',
          defaultValue: '',
          props: {
            label: 'Año:',
            required: true,
          },
        },
        {
          className: 'col-sm-12 col-md-12 col-lg-4',
          key: 'tipoVehiculo',
          type: 'select',
          props: {
            label: 'Tipo de Vehículo',
            options: [
              { label: 'Carro', value: 'CARRO' },
              { label: 'Moto', value: 'MOTO' },
            ],
          },
        },
      ]
    },
  ];

  ngOnInit(): void {
    this.estadoSpinner = false;
    let i = 0;
    //Se pasan los valores del objeto, a un vector
    let arrayVehiculo = [EditarVehiculoComponent.objectVehiculo.placa,
      EditarVehiculoComponent.objectVehiculo.marca,
      EditarVehiculoComponent.objectVehiculo.modelo,
      EditarVehiculoComponent.objectVehiculo.color,
      EditarVehiculoComponent.objectVehiculo.anio,
      EditarVehiculoComponent.objectVehiculo.tipoVehiculo
    ]
    //Se llena el objeto de formly con los datos seleccionados
    this.fieldsEditVehiculo.forEach(element2 => {
      element2.fieldGroup.forEach(element3 => {
        element3.defaultValue = arrayVehiculo[i]
        i++;
      });
    });
    this.estadoSpinner = true;
  }

  //Método que edita la información de un vehículo
  editarVehiculo() {
    this.estadoSpinner = false;
    this.api.putDatos("/vehiculo/"+EditarVehiculoComponent.objectVehiculo.id, this.modelEditVehiculo.fields).subscribe(data =>{
      this.estadoSpinner = true;
      this.alertaEmergente.alertaOKSinReload("Se ha editado la información correctamente");
      this.modal.dismissAll();
    }, error =>{
      this.alertaEmergente.alertaErrorSinReloadBtn("No se ha podido editar la información");
      this.estadoSpinner = true;
    });
  }


  //Iconos a utilizar
  iconCancelar = iconos.faBan;
  iconEliminar = iconos.faTrash;
  iconAceptar = iconos.faCheck;
  iconEditar = iconos.faEdit;
}
