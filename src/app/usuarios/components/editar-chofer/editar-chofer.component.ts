import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { Alerts } from './../../alerts/alerts.component';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
/*Para los íconos*/
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-editar-chofer',
  templateUrl: './editar-chofer.component.html',
  styleUrls: ['./editar-chofer.component.css']
})
export class EditarChoferComponent implements OnInit {

  //Variables y objetos a utilizar
  static objectChofer = {
    id: "",
    ci: "",
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    licencia: "A"
  };
  estadoSpinner = false;

  constructor(
    public modal: NgbModal,
    private api: ConsumirServiciosService,
    public alertaEmergente: Alerts
  ) { }


  /*Form para editar los datos del chofer*/
  formEditChofer = new FormGroup({});
  modelEditChofer: any = {};
  optionsEditChofer: FormlyFormOptions = {};
  fieldsEditChofer: FormlyFieldConfig[] = [
    {
      key: 'fields',
      fieldGroupClassName: 'row',
      fieldGroup: [
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
          className: 'col-sm-12 col-md-12 col-lg-4',
          type: 'input',
          key: 'telefono',
          defaultValue: '',
          props: {
            label: 'Teléfono:',
            required: true,
          },
        },
        {
          className: 'col-sm-12 col-md-12 col-lg-10',
          type: 'input',
          key: 'direccion',
          defaultValue: '',
          props: {
            label: 'Dirección:',
            required: true,
          },
        },
        {
          className: 'col-sm-12 col-md-12 col-lg-2',
          type: 'input',
          key: 'tipolicencia',
          defaultValue: '',
          props: {
            label: 'Licencia:',
            required: true,
          },
        },
      ]
    },
  ];


  ngOnInit(): void {
    this.estadoSpinner = false;
    let i = 0;
    //Se pasan los valores del objeto, a un vector
    let arrayChofer = [
      EditarChoferComponent.objectChofer.nombre,
      EditarChoferComponent.objectChofer.apellido,
      EditarChoferComponent.objectChofer.telefono,
      EditarChoferComponent.objectChofer.direccion,
      EditarChoferComponent.objectChofer.licencia
    ]
    //Se llena el objeto de formly con los datos seleccionados
    this.fieldsEditChofer.forEach(element2 => {
      element2.fieldGroup.forEach(element3 => {
        element3.defaultValue = arrayChofer[i]
        i++;
      });
    });
    this.estadoSpinner = true;
  }


  //Método que manda a modificar los datos personales del chofer
  editarChofer() {
    this.estadoSpinner = false;
    this.api.putDatos("/chofer/" + EditarChoferComponent.objectChofer.id, this.modelEditChofer.fields).subscribe(data => {
      this.estadoSpinner = true;
      this.alertaEmergente.alertaOKConReload("Se ha editado la información correctamente");
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
