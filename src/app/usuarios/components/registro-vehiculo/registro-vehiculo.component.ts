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

  constructor() { }

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
            className: 'col-4',
            type: 'input',
            key: 'placa',
            props: {
              label: 'Placa:',
              required: true,
            },
          },
          {
            className: 'col-4',
            type: 'input',
            key: 'marca',
            props: {
              label: 'Marca:',
              required: true,
            },
          },
          {
            className: 'col-4',
            type: 'input',
            key: 'Modelo',
            props: {
              label: 'Modelo:',
              required: true,
            },
          },
          {
            className: 'col-4',
            type: 'input',
            key: 'color',
            props: {
              label: 'Color:',
              required: true,
            },
          },
          {
            className: 'col-4',
            type: 'input',
            key: 'anio',
            props: {
              label: 'Año de modelo:',
              required: true,
            },
          },
          {
            className: 'col-4',
            key: 'tipoVehiculo',
            type: 'select',
            props: {
              required: true,
              label: 'Tipo de vehículo:',
              options: [
                { label: 'Carro', value: 'Carro' },
                { label: 'Moto', value: 'Moto' },
                { label: 'Furgoneta', value: 'Furgoneta' },
              ],
            },
          },
        ]
      },
    },
  ];

  iconCarro = iconos.faCar;
}
