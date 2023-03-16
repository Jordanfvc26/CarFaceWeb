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
  estadoSpinner = false;

  constructor(private _cargarScripts: CargarScriptsJsService, private ruta: Router) {
    _cargarScripts.CargarJS(["dashboard/dashboard"]);
  }

  //Al inciar comprobamos que exista un sessionStorage y según eso se muestra el menú de opciones
  ngOnInit(): void {
    this.estadoSpinner = false;
    if (sessionStorage.getItem("usuario") == null && sessionStorage.getItem("rol") == null) {
      this.ruta.navigateByUrl('/login');
    }
    this.nomUsuario = sessionStorage.getItem("usuario") || "usuario2";
    this.rolUsuario = sessionStorage.getItem("rol") || "Usuario";
    this.menuOpciones.push({ icono: this.iconInicio, nombre: "Inicio" })
    if (sessionStorage.getItem("rol") == "CHOFER") {
      this.menuOpciones.push({ icono: this.iconAgregar, nombre: "Registrar vehículos", habilitado: true })
      this.menuOpciones.push({ icono: this.iconAgregar, nombre: "Mis vehículos", habilitado: true })
      this.menuOpciones.push({ icono: this.iconMovimientos, nombre: "Movimientos", habilitado: true })
      this.menuOpciones.push({ icono: this.iconListUser, nombre: "Mi perfil", habilitado: true })
      this.menuOpciones.push({ icono: this.iconCerrarSesion, nombre: "Cerrar sesión", habilitado: true })
      this.estadoSpinner = true;
    }
    else {
      this.menuOpciones.push({ icono: this.iconGuardia, nombre: "Crear Guardias", habilitado: true })
      this.menuOpciones.push({ icono: this.iconListUser, nombre: "Listar Guardias", habilitado: true })
      this.menuOpciones.push({ icono: this.iconChoferes, nombre: "Listar Choferes", habilitado: true })
      this.menuOpciones.push({ icono: this.iconCerrarSesion, nombre: "Cerrar sesión", habilitado: true })
      this.estadoSpinner = true;
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
    this.estadoSpinner = false;
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("rol");
    setTimeout(() => {
      this.estadoSpinner = true;
      this.ruta.navigateByUrl('/login');
    }, 2100);
  
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
  iconListUser = iconos.faUser;
  iconCerrarSesion = iconos.faSignOutAlt;
  iconGuardia = iconos.faUserShield;
  iconChoferes = iconos.faUsers;
}
