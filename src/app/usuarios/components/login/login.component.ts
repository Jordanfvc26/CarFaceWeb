//Para la cámara
import { WebcamImage } from 'ngx-webcam';

import { Alerts } from './../../alerts/alerts.component';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { Router, RouterLink } from '@angular/router';
import { CargarScriptsJsService } from './../../services/cargar-scripts-js.service';
import { Component, OnInit } from '@angular/core';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //Fomr para loguearse
  loginForm = new FormGroup({
    correo: new FormControl('', Validators.required),
    clave: new FormControl('', Validators.required)
  })
  //Variables a utilizar
  estadoSpinner = false;
  indice=0;
  webcamImage:WebcamImage | undefined

  handleImage(webcamImage:WebcamImage){
    this.webcamImage = webcamImage;
  }


  constructor(
    private _cargarScripts:CargarScriptsJsService, 
    private ruta:Router,
    private api: ConsumirServiciosService,
    public alertaEmergente: Alerts) {
    _cargarScripts.CargarJS(["login/login"]);
  }

  ngOnInit(): void {
    this.estadoSpinner = true;
  }

  //Método para iniciar sesión
  iniciarSesion(){
    this.estadoSpinner = false;
    let headers = new Map();
    headers.set("correo", this.loginForm.value.correo);
    headers.set("clave", this.loginForm.value.clave) ;
    //console.log(headers);
    this.api.postDatos("/sesion/login", null, headers).subscribe(data=>{
      sessionStorage.setItem("usuario", data.token);
      sessionStorage.setItem("rol", data.rol)
      this.estadoSpinner = true;
      this.alertaEmergente.alertaOKConReload("Inicio de sesión exitoso");
      if (data.rol == 'CHOFER') {
        this.ruta.navigateByUrl('/dashboard');
      }
      else {
        this.ruta.navigateByUrl('/dashboard');
      }
    }, error =>{
      console.log(error);
      this.alertaEmergente.alertaErrorSinReload("Credenciales incorrectas");
      this.estadoSpinner = true;
    })
  }

  //Método que cambia el indice y abre el formulario de registro
  abrirFormRegistro(){
    this.estadoSpinner = false;
    this.indice = 1;
    this.ruta.navigateByUrl('/registro-usuario');
    this.estadoSpinner = true;
  }


  //Iconos a utilizar
  iconCandado = iconos.faLock;
  iconOjo = iconos.faEye;
  iconUser = iconos.faUser;
  iconEmail = iconos.faEnvelope;
  iconCedula = iconos.faIdCard;


}
