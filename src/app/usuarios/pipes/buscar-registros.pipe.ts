import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscarRegistros'
})
export class BuscarRegistrosPipe implements PipeTransform {

  transform(value: any, arg: any, filtro:string): any {
    const resultRegistro = [];
    let i = 0;
    for (const temp of value) {
      if (temp[filtro].indexOf(arg) > -1) {
        resultRegistro.push(temp);
      }
      i++;
    };
    return resultRegistro;
  }
}


