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

  constructor(private _cargarScripts:CargarScriptsJsService, private ruta:Router) {
    _cargarScripts.CargarJSDashboardCliente(["dashboard/dashboard"]);
  }

  ngOnInit(): void {
  }


  iconCarro = iconos.faCarSide;
  iconInicio = iconos.faHome;
  iconAgregar = iconos.faCar;

}
