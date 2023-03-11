import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { Alerts } from './../../alerts/alerts.component';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
/*Para los íconos*/
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-editar-guardia',
  templateUrl: './editar-guardia.component.html',
  styleUrls: ['./editar-guardia.component.css']
})
export class EditarGuardiaComponent implements OnInit {

  static datosGuardia = [];
  guardia = {};


  constructor(
    public modal: NgbModal,
    private api: ConsumirServiciosService,
    public alertaEmergente: Alerts
  ) { }


  /*Form para editar los datos de un guardia*/
  formEditGuardia = new FormGroup({});
  modelEditGuardia: any = {};
  optionsEditGuardia: FormlyFormOptions = {};
  fieldsEditGuardia: FormlyFieldConfig[] = [
    {
      key: 'fields',
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-sm-12 col-md-12 col-lg-3',
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
          className: 'col-sm-12 col-md-12 col-lg-4',
          type: 'input',
          key: 'correo',
          props: {
            label: 'E-mail:',
            required: true,
          },
        },
        {
          className: 'col-sm-12 col-md-12 col-lg-6',
          type: 'input',
          key: 'compania',
          props: {
            label: 'Nombre de la compañía:',
            required: true,
          },
        },
        {
          className: 'col-sm-12 col-md-12 col-lg-6',
          type: 'input',
          key: 'estado',
          props: {
            label: 'Estado:',
            required: true,
          },
        },
      ]
    },
  ];

  ngOnInit(): void {

    EditarGuardiaComponent.datosGuardia.forEach(element => {
      this.guardia = {
        "ci": element.ci,
        "nombre": element.nombre,
        "correo": element.correo,
        "empresa": element.empresa,
        "estado": element.estado
      }
    })

    console.log(this.guardia);

    /*this.fieldsEditGuardia.forEach(element2 => {
      element2.fieldGroup.forEach(element3 => {
        

      });
    });*/



    console.log("Recibido ")
    console.log(EditarGuardiaComponent.datosGuardia);
  }

  editarGuardia() {

  }


  //Iconos a utilizar
  iconCancelar = iconos.faBan;
  iconEliminar = iconos.faTrash;
  iconAceptar = iconos.faCheck;
  iconEditar = iconos.faEdit;

}
