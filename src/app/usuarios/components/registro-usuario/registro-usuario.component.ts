import { Router } from '@angular/router';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { Alerts } from './../../alerts/alerts.component';
import { CargarScriptsJsService } from './../../services/cargar-scripts-js.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.css', './registro-usuario2.component.css']
})
export class RegistroUsuarioComponent implements OnInit {

  constructor(
    private _cargarScripts:CargarScriptsJsService, 
    private ruta:Router,
    private api: ConsumirServiciosService,
    public alertaEmergente: Alerts) { 
      _cargarScripts.CargarJS(["registro-usuario/registro-usuario"]);
    }

  ngOnInit(): void {
  }

}
