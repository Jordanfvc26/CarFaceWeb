import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { Router } from '@angular/router';
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
    private api: ConsumirServiciosService,) {
    _cargarScripts.CargarJSLogin(["login/login"]);
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
      alert(data);
      console.log(data);
    })
  }


  //Iconos a utilizar
  iconCandado = iconos.faLock;
  iconOjo = iconos.faEye;
  iconUser = iconos.faUser;


}
