import { Alerts } from './../../alerts/alerts.component';
import { Router } from '@angular/router';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { Component, OnInit } from '@angular/core';

/*Importaciones para usar el formly*/
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';

import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-crear-guardia',
  templateUrl: './crear-guardia.component.html',
  styleUrls: ['./crear-guardia.component.css']
})
export class CrearGuardiaComponent implements OnInit {

  static siAgrego = false;

  constructor(
    private _guardiaService: ConsumirServiciosService,
    private ruta: Router,
    public alertaEmergente: Alerts
  ) { }

  ngOnInit(): void {
  }

  /*Form para crear a los Guardias */
  formNewGuardia = new FormGroup({});
  modelNewGuardia: any = {};
  optionsNewGuardia: FormlyFormOptions = {};
  fieldsNewGuardia: FormlyFieldConfig[] = [
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
            className: 'col-sm-12 col-md-12 col-lg-2',
            type: 'input',
            key: 'ci',
            props: {
              label: 'Cédula:',
              required: true,
            },
          },
          {
            className: 'col-sm-12 col-md-12 col-lg-5',
            type: 'input',
            key: 'nombre',
            props: {
              label: 'Nombres:',
              required: true,
            },
          },
          {
            className: 'col-sm-12 col-md-12 col-lg-5',
            type: 'input',
            key: 'apellido',
            props: {
              label: 'Apellidos:',
              required: true,
            },
          },
          {
            className: 'col-sm-12 col-md-12 col-lg-8',
            type: 'input',
            key: 'correo',
            props: {
              label: 'E-mail:',
              required: true,
            },
          },
          {
            className: 'col-sm-12 col-md-12 col-lg-4',
            type: 'input',
            key: 'clave',
            props: {
              label: 'Contraseña:',
              required: true,
              type: 'password'
            },
          },
          {
            className: 'col-sm-12 col-md-12 col-lg-4',
            type: 'input',
            key: 'compania',
            props: {
              label: 'Nombre de la compañía:',
              required: true,
            },
          },
          {
            className: 'col-sm-12 col-md-12 col-lg-4',
            type: 'input',
            key: 'fecha_inicio',
            props: {
              label: 'Fecha inicio de contrato:',
              required: true,
            },
          },
          {
            className: 'col-sm-12 col-md-12 col-lg-4',
            type: 'input',
            key: 'fecha_fin',
            props: {
              label: 'Fecha inicio de contrato:',
              required: true,
            },
          },
        ]
      },
    },
  ];

  //Método que registra a los guardias en la base de datos
  registrarGuardias() {
    //Verifica si ha agregado la sección del repeat
    if (CrearGuardiaComponent.siAgrego == true) {
      if(this.modelNewGuardia.fields[0]!= null){
        for (let index = 0; index < this.modelNewGuardia.fields.length; index++) {
          console.log(this.modelNewGuardia.fields[index]);
          this._guardiaService.postDatos("/guardia", this.modelNewGuardia.fields[index]).subscribe((res) => {
            console.log(res);
            this.alertaEmergente.alertaOKSinReloadBtn("Se ha registrado correctamente a los guardias");
            this.ruta.navigateByUrl('/dashboard');
          }, error => {
            this.alertaEmergente.alertaErrorSinReloadBtn("No se ha podido registrar a los guardias");
          })
        }
      }
      else{
        this.alertaEmergente.alertaOKSinReloadBtn("Primero debe llenar los campos");
      }
    }
    else {
      this.alertaEmergente.alertaErrorSinReloadBtn("Primero debe agregar registros");
    }
  }

  //Iconos a utilizar
  iconGuardia = iconos.faUserShield;
  iconRegistrar = iconos.faCheck;

}
