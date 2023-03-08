import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'formly-repeat-section',
  template: `
    <div class="mb-3">
      <legend *ngIf="props.label">{{ props.label }}</legend>
      <p *ngIf="props.description">{{ props.description }}</p>

      <div style="text-align: start; margin-bottom:10px">
        <button class="btn btn-primary" type="button" (click)="add()"> <fa-icon [icon]="iconAgregar"></fa-icon> Nuevo</button>
      </div>
      
      <div *ngFor="let field of field.fieldGroup; let i = index" class="row align-items-baseline" style="border: 1px solid rgba(179, 179, 179, 0.863); border-radius: 10px; margin-bottom: 10px;">

      <h5 style="margin-top: 20px;"> <b>Registro N° {{i+1}}:</b></h5>
        <formly-field class="col" [field]="field"></formly-field >
        <div class="col-sm-12 col-md-12 col-lg-1 d-flex align-items-center" style="margin-bottom:10px;">
          <button class="btn btn-danger" type="button" (click)="remove(i)"> <fa-icon [icon]="iconDelete"></fa-icon> </button>
        </div>
      </div>
    </div>
  `,
})


export class RepeatTypeComponent extends FieldArrayType {
  iconDelete = iconos.faTrash;
  iconAgregar = iconos.faPlus;
}