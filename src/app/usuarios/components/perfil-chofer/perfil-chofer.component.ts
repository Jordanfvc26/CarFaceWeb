import { Alerts } from './../../alerts/alerts.component';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-perfil-chofer',
  templateUrl: './perfil-chofer.component.html',
  styleUrls: ['./perfil-chofer.component.css']
})
export class PerfilChoferComponent implements OnInit {

  constructor(
    private ruta: Router,
    private api: ConsumirServiciosService,
    public alertaEmergente: Alerts) { }

  ngOnInit(): void {
  }


  
}
