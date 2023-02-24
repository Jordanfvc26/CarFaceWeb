import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChoferService } from './../../services/chofer.service';
import { Router } from '@angular/router';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { Alerts } from './../../alerts/alerts.component';
import { CargarScriptsJsService } from './../../services/cargar-scripts-js.service';
import { Component, OnInit } from '@angular/core';

import * as iconos from '@fortawesome/free-solid-svg-icons';
import * as AOS from 'aos';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.css', './registro-usuario2.component.css']
})
export class RegistroUsuarioComponent implements OnInit {

  constructor(
    private _choferService: ChoferService,
    private _cargarScripts: CargarScriptsJsService,
    private ruta: Router,
    private api: ConsumirServiciosService,
    public alertaEmergente: Alerts) {
    _cargarScripts.CargarJS(["registro-usuario/registro-usuario"]);
  }

  //Creando el formGroup del usuario a registrar
  formDatosChofer = new FormGroup({
    ci: new FormControl('', Validators.required),
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required),
    licencia: new FormControl('Tipo-licencia', Validators.required),
    correo: new FormControl('', Validators.email),
    clave: new FormControl('', Validators.required)
  })

  ngOnInit(): void {
    
  }

  //Método para registrar el chofer
  registrarChofer(): void {

    //Pasando los datos del formGroup a la interfaz
    let body: any = {
      "ci": this.formDatosChofer.value.ci,
      "nombre": this.formDatosChofer.value.nombre,
      "apellido": this.formDatosChofer.value.apellido,
      "correo": this.formDatosChofer.value.correo,
      "clave": this.formDatosChofer.value.clave,
      "tipolicencia": this.formDatosChofer.value.licencia,
      "direccion": "Quevedo",
      "telefono": this.formDatosChofer.value.telefono,
    }

    this._choferService.registerChofer(body).subscribe((res) => {
      console.log(res);
      this.alertaEmergente.alertaMensajeOK("Se ha registrado correctamente en CarFace");
      this.ruta.navigateByUrl('/login');
    }, error => {
      this.alertaEmergente.alertMensajeError("No se ha podido registrar en CarFace");
    });
  }

  alertaRellenar(){
    if(this.formDatosChofer.value.ci == "" || this.formDatosChofer.value.nombre == "" || this.formDatosChofer.value.apellido == "" || this.formDatosChofer.value.telefono == "" || this.formDatosChofer.value.licencia == "Tipo-licencia")
    {
      this.alertaEmergente.alertMensajeError("Debe rellenar todos los campos");
    }
  }

  iconCedula = iconos.faIdCard;
}
