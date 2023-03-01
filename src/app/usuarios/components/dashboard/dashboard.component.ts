import { CargarScriptsJsService } from './../../services/cargar-scripts-js.service';
import { Component, OnInit } from '@angular/core';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  //Atributos
  opcionMenu = 0;
  nomUsuario = "usuario";
  rolUsuario = "rol";
  menuOpciones: any[] = [];


  constructor(private _cargarScripts: CargarScriptsJsService, private ruta: Router) {
    _cargarScripts.CargarJS(["dashboard/dashboard"]);
  }

  //Al inciar comprobamos que exista un sessionStorage y según eso se muestra el menú de opciones
  ngOnInit(): void {
    if (sessionStorage.getItem("usuario") == null && sessionStorage.getItem("rol") == null) {
      this.ruta.navigateByUrl('/login');
    }
    this.nomUsuario = sessionStorage.getItem("usuario") || "usuario2";
    this.rolUsuario = sessionStorage.getItem("rol") || "Usuario";
    this.menuOpciones.push({ icono: this.iconInicio, nombre: "Inicio" })
    if (sessionStorage.getItem("rol") == "CHOFER") {
      this.menuOpciones.push({ icono: this.iconAgregar, nombre: "Mis vehículos", habilitado: true })
      this.menuOpciones.push({ icono: this.iconMovimientos, nombre: "Movimientos", habilitado: true })
      this.menuOpciones.push({ icono: this.iconGuardias, nombre: "Guardias", habilitado: true })
      this.menuOpciones.push({ icono: this.iconCerrarSesion, nombre: "Cerrar sesión", habilitado: true })
    }
    else {
      this.menuOpciones.push({ icono: this.iconMovimientos, nombre: "Movimientos", habilitado: true })
      this.menuOpciones.push({ icono: this.iconGuardias, nombre: "Guardias", habilitado: true })
      this.menuOpciones.push({ icono: this.iconCerrarSesion, nombre: "Cerrar sesión", habilitado: true })
    }
  }

  //Inidice para mostrar componentes dentro del dashboard
  cambiarIndiceMenu(indice: number) {
    this.opcionMenu = indice;
    if(this.opcionMenu == 4){
      this.cerrarSesion();
    }
    console.log(this.opcionMenu);
  }

  //Método para cerrar la sesión y remover el sessionStorage
  cerrarSesion(){
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("rol");
    this.ruta.navigateByUrl('/login');
  }

  //Iconos generales
  iconCarro = iconos.faCarSide;
  iconBarras = iconos.faBars;
  iconFlechaAbajo = iconos.faAngleDown;
  iconConfiguracion = iconos.faSlidersH;

  //Iconos del menu de opciones del chofer y administrador
  iconInicio = iconos.faHome;
  iconAgregar = iconos.faCar;
  iconMovimientos = iconos.faCalendar;
  iconGuardias = iconos.faUser;
  iconCerrarSesion = iconos.faSignOutAlt;

  
  

}
