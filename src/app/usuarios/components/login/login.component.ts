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


  constructor(
    private _cargarScripts:CargarScriptsJsService, 
    private ruta:Router,
    private api: ConsumirServiciosService,
    public alertaEmergente: Alerts) {
    _cargarScripts.CargarJS(["login/login"]);
  }

  ngOnInit(): void {

  }

  //Método para iniciar sesión
  iniciarSesion(){
    let headers = new Map();
    headers.set("correo", this.loginForm.value.correo);
    headers.set("clave", this.loginForm.value.clave) ;
    console.log(headers);

    this.api.postDatos("/sesion/login", null, headers).subscribe(data=>{
      sessionStorage.setItem("usuario", data.token);
      this.ruta.navigateByUrl('/dashboard');
      //Capturar el rol
      this.alertaEmergente.alertaMensajeOK("Se ha iniciar sesión correctamente");
    }, error =>{
      console.log(error);
      this.alertaEmergente.alertMensajeError("No se ha podido iniciar sesión, inténtalo más tarde");
    })
  }

  abrirFormRegistro(){
    this.ruta.navigateByUrl('/registro-usuario');
  }


  //Iconos a utilizar
  iconCandado = iconos.faLock;
  iconOjo = iconos.faEye;
  iconUser = iconos.faUser;
  iconEmail = iconos.faEnvelope;
  iconCedula = iconos.faIdCard;


}
