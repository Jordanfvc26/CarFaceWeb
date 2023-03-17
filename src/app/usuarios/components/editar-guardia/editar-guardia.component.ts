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

  //Variables y objetos a utilizar
  static objectGuardia = {
    id: "",
    ci: "",
    nombre: "",
    apellido: "",
    empresa: "",
    fecha_inicio: "",
    fecha_fin: "",
  };
  estadoSpinner = false;
  opciones: any;
  opciones2: any;
  arrayGuardia: any[] = [];

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
          className: 'col-sm-12 col-md-12 col-lg-4',
          type: 'input',
          key: 'ci',
          defaultValue: '',
          props: {
            label: 'Cédula:',
            required: true,
          },
        },
        {
          className: 'col-sm-12 col-md-12 col-lg-4',
          type: 'input',
          key: 'nombre',
          defaultValue: '',
          props: {
            label: 'Nombres:',
            required: true,
          },
        },
        {
          className: 'col-sm-12 col-md-12 col-lg-4',
          type: 'input',
          key: 'apellido',
          defaultValue: '',
          props: {
            label: 'Apellidos:',
            required: true,
          },
        },
        {
          className: 'col-sm-12 col-md-12 col-lg-12',
          type: 'input',
          key: 'compania',
          defaultValue: '',
          props: {
            label: 'Compañía:',
            required: true,
          },
        },
        {
          className: 'col-sm-12 col-md-12 col-lg-6',
          type: 'input',
          key: 'fecha_inicio',
          defaultValue: '',
          props: {
            label: 'Fecha de incio:',
            required: true,
          },
        },
        {
          className: 'col-sm-12 col-md-12 col-lg-6',
          type: 'input',
          key: 'fecha_fin',
          defaultValue: '',
          props: {
            label: 'Fecha de fin:',
            required: true,
          },
        },
      ]
    },
  ];


  ngOnInit(): void {
    this.estadoSpinner = false;
    let i = 0;
    //Obteniendo la fecha de los guardias
    this.api.getDatos("/admin/usuario/id?id=" + EditarGuardiaComponent.objectGuardia.id).subscribe(data => {
      //Formateando fecha_inicio
      const fechaInicio: string = data.guardia.fecha_inicio;
      const subFechaInicio: string = fechaInicio.substring(0, 10);
      //Formateando fecha_fin
      const fechaFin: string = data.guardia.fecha_fin;
      const subFechaFin: string = fechaFin.substring(0, 10);
      //Pasando las fechas al objeto
      EditarGuardiaComponent.objectGuardia.fecha_inicio = subFechaInicio,
        EditarGuardiaComponent.objectGuardia.fecha_fin = subFechaFin
    }, error => {
      this.alertaEmergente.alertaErrorSinReloadBtn("No se pudieron obtener las fechas");
      this.estadoSpinner = true;
    })

    //Se pasan los valores del objeto, a un vector
    this.arrayGuardia = [EditarGuardiaComponent.objectGuardia.ci,
    EditarGuardiaComponent.objectGuardia.nombre,
    EditarGuardiaComponent.objectGuardia.apellido,
    EditarGuardiaComponent.objectGuardia.empresa,
    EditarGuardiaComponent.objectGuardia.fecha_inicio,
    EditarGuardiaComponent.objectGuardia.fecha_fin
    ]
    //Se llena el objeto de formly con los datos seleccionados
    this.fieldsEditGuardia.forEach(element2 => {
      element2.fieldGroup.forEach(element3 => {
        element3.defaultValue = this.arrayGuardia[i]
        i++;
      });
    });
    this.estadoSpinner = true;
  }


  //Método que manda a modificar los datos del guardia
  editarGuardia() {
    this.estadoSpinner = false;
    this.api.putDatos("/guardia/editar/" + EditarGuardiaComponent.objectGuardia.id, this.modelEditGuardia.fields).subscribe(data => {
      this.estadoSpinner = true;
      this.alertaEmergente.alertaOKSinReload("Se ha editado la información correctamente");
      this.modal.dismissAll();
    }, error => {
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
