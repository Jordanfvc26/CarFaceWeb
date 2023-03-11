import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { Router } from '@angular/router';
import { Alerts } from './../../alerts/alerts.component';
import { VehiculosService } from './../../services/vehiculos.service';
import { Component, OnInit } from '@angular/core';
import * as iconos from '@fortawesome/free-solid-svg-icons';

/*Importaciones necesarias para usar el formly*/
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-registro-vehiculo',
  templateUrl: './registro-vehiculo.component.html',
  styleUrls: ['./registro-vehiculo.component.css']
})
export class RegistroVehiculoComponent implements OnInit {

  constructor(
    private _vehiculoService: ConsumirServiciosService,
    private ruta: Router,
    public alertaEmergente: Alerts
  ) { }

  ngOnInit(): void {
  }

  /*Form para crear a los Estudiantes */
  formNewCarro = new FormGroup({});
  modelNewCarro: any = {};
  optionsNewCarro: FormlyFormOptions = {};
  fieldsNewCarro: FormlyFieldConfig[] = [
    {
      key: 'fields',
      type: 'repeat',
      props: {
        addText: 'Add Task',
      },
      fieldArray: {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-sm-12 col-md-12 col-lg-4',
            type: 'input',
            key: 'placa',
            props: {
              label: 'Placa:',
              required: true,
            },
          },
          {
            className: 'col-sm-12 col-md-12 col-lg-4',
            type: 'input',
            key: 'marca',
            props: {
              label: 'Marca:',
              required: true,
            },
          },
          {
            className: 'col-sm-12 col-md-12 col-lg-4',
            type: 'input',
            key: 'modelo',
            props: {
              label: 'Modelo:',
              required: true,
            },
          },
          {
            className: 'col-sm-12 col-md-12 col-lg-4',
            type: 'input',
            key: 'color',
            props: {
              label: 'Color:',
              required: true,
            },
          },
          {
            className: 'col-sm-12 col-md-12 col-lg-4',
            type: 'input',
            key: 'año',
            props: {
              label: 'Año de modelo:',
              required: true,
            },
          },
          {
            className: 'col-sm-12 col-md-12 col-lg-4',
            key: 'tipoVehiculo',
            type: 'select',
            props: {
              required: true,
              label: 'Tipo de vehículo:',
              options: [
                { label: 'Carro', value: 'CARRO' },
                { label: 'Moto', value: 'MOTO' },
                { label: 'Furgoneta', value: 'Furgoneta' },
              ],
            },
          },
        ]
      },
    },
  ];

  registrarVehiculos(): void {
    if (!this.fieldsNewCarro) {
      var datosTabla: JSON = <JSON><unknown>{
        "vehiculos": this.modelNewCarro.fields
      }

      for (let index = 0; index < this.modelNewCarro.fields.length; index++) {
        console.log(this.modelNewCarro.fields[index]);
        this._vehiculoService.postDatos("/vehiculo", this.modelNewCarro.fields[index]).subscribe((res) => {
          console.log(res);
          this.alertaEmergente.alertaOKConReloadBtn("Se han registrado correctamente sus vehículos");
          this.ruta.navigateByUrl('/dashboard');
        }, error => {
          this.alertaEmergente.alertaErrorSinReload("No se ha podido registrar sus vehículos");
        })
      }
    }
    else {
      this.alertaEmergente.alertaErrorSinReloadBtn("Primero debe agregar registros");
    }
  }

  //Iconos a utilizar
  iconCarro = iconos.faCar;
}
