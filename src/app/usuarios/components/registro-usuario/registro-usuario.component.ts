import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChoferService } from './../../services/chofer.service';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { Alerts } from './../../alerts/alerts.component';
import { CargarScriptsJsService } from './../../services/cargar-scripts-js.service';
import { Component, OnInit } from '@angular/core';
/*Para íconos*/
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.css', './registro-usuario2.component.css']
})
export class RegistroUsuarioComponent implements OnInit {
  estadoSpinner: boolean = false;

  static usuario = "";
  static clave = "";

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
    licencia: new FormControl('Tipo-licencia', Validators.required),
    telefono: new FormControl('', Validators.required),
    canton: new FormControl('canton', Validators.required),
    direccion: new FormControl('', Validators.required),
    correo: new FormControl('', Validators.email),
    clave: new FormControl('', Validators.required)
  })

  ngOnInit(): void {
    this.estadoSpinner = true;
  }

  //Método que abre el login
  abrirLogin() {
    this.estadoSpinner = false;
    this.ruta.navigateByUrl('/Login');
    this.estadoSpinner = true;
  }

  //Método que indica que primero debe rellenar todos los campos
  alertaRellenar() {
    if (this.formDatosChofer.value.ci == "" || this.formDatosChofer.value.nombre == "" || this.formDatosChofer.value.apellido == "" || this.formDatosChofer.value.licencia == "Tipo-licencia") {
      this.alertaEmergente.alertaErrorSinReloadBtn("Primero debe rellenar todos los campos");
    }
  }

  //Método para registrar los datos personales y de inicio de sesión del chofer
  registrarChofer(): void {
    this.estadoSpinner = false;
    let body: any = {
      "ci": this.formDatosChofer.value.ci,
      "nombre": this.formDatosChofer.value.nombre,
      "apellido": this.formDatosChofer.value.apellido,
      "tipolicencia": this.formDatosChofer.value.licencia,
      "telefono": this.formDatosChofer.value.telefono,
      "direccion": this.formDatosChofer.value.direccion,
      "correo": this.formDatosChofer.value.correo,
      "clave": this.formDatosChofer.value.clave,
    }
    RegistroUsuarioComponent.usuario = this.formDatosChofer.value.correo;
    RegistroUsuarioComponent.clave = this.formDatosChofer.value.clave;

    this.api.postDatos("/chofer",body).subscribe(res => {
      this.estadoSpinner = true
      this.alertaEmergente.alertaOKSinReloadBtn("Registro de información personal exitoso")
      //this.iniciarSesion(this.formDatosChofer.value.correo, this.formDatosChofer.value.clave);
      this.ruta.navigateByUrl('/dashboard');
    }, error => {
      this.alertaEmergente.alertaErrorSinReload("No se pudo registrar su información");
      this.estadoSpinner = true;
    });
  }

  //Iconos a utilizar
  iconCedula = iconos.faIdCard;
}