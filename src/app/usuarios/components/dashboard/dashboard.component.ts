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

  opcionMenu = 0;

  constructor(private _cargarScripts: CargarScriptsJsService, private ruta: Router) {
    _cargarScripts.CargarJS(["dashboard/dashboard"]);
  }

  ngOnInit(): void {
    if (sessionStorage.getItem("usuario") == null) {
      this.ruta.navigateByUrl('/login');
    }
    console.log(this.opcionMenu);
  }

  cambiarIndiceMenu(indice:number){
    this.opcionMenu = indice;
    console.log(this.opcionMenu);
  }

  cerrarSesion(){
    sessionStorage.removeItem("usuario");
    this.ruta.navigateByUrl('/login');
  }

  iconCarro = iconos.faCarSide;
  iconInicio = iconos.faHome;
  iconAgregar = iconos.faCar;
  iconBarras = iconos.faBars;
  iconFlechaAbajo = iconos.faAngleDown;
  iconMovimientos = iconos.faCalendar;

  iconUsuario = iconos.faUser;
  iconConfiguracion = iconos.faSlidersH;
  iconCerrarSesion = iconos.faSignOutAlt;

}
