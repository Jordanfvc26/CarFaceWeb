import { EditarGuardiaComponent } from './../editar-guardia/editar-guardia.component';
import { Router } from '@angular/router';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { Alerts } from './../../alerts/alerts.component';
import { ChoferService } from './../../services/chofer.service';
import { Component, OnInit } from '@angular/core';
/*Para los íconos*/
import * as iconos from '@fortawesome/free-solid-svg-icons';

/*Para generar PDF y Excel*/
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
/*Para la ventana emergente*/
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-listar-guardias',
  templateUrl: './listar-guardias.component.html',
  styleUrls: ['./listar-guardias.component.css']
})
export class ListarGuardiasComponent implements OnInit {

  guardias: any[] = [];
  opciones: any;
  estado: any;

  constructor(
    private _choferService: ChoferService,
    public alertaEmergente: Alerts,
    private api: ConsumirServiciosService,
    public modal: NgbModal
  ) { }

  ngOnInit(): void {
    let headers = new Map();
    this.api.getDatos("/guardia/all").subscribe(data => {
      data.forEach(element => {
        //Dando formato al vector
        if (element.estado == true) {
          this.estado = "ACTIVO";
        }
        else {
          this.estado = "INACTIVO";
        }

        //Formateando los nombres
        const nombreCompleto = element.nombre;
        const nombresSeparados = nombreCompleto.split(" ");
        const nombre1 = nombresSeparados[0];
        const nombre2 = nombresSeparados[1];
        const apellido1 = nombresSeparados[2];
        const apellido2 = nombresSeparados[3];

        let guardia = {
          "id": element.id,
          "ci": element.ci,
          "nombre": nombre1 + " " + nombre2,
          "apellido": apellido1 + " " + apellido2,
          "correo": element.correo,
          "empresa": element.empresa,
          "estado": this.estado
        }
        //Agregando los datos finaes al vector
        this.guardias.push(guardia);
      });
    }, error => {
      console.log(error);
      this.alertaEmergente.alertaErrorSinReloadBtn("No se pudieron cargar los datos");
    })
  }


  //Método para imprimir los movimientos del chofer, en PDF
  downloadPDF() {
    //Se extrae la información a plasmar en el PDF
    const DATA = document.getElementById('htmlTablaPDF');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');
      //Agregar image Canvas al PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      //Se obtiene la fecha actual del sistema y se le concatena el nombre para darle un nombre final al archivo descargado
      const fechaPDF = new Date().toISOString()
      const fecha = new Date(fechaPDF);
      this.opciones = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      };
      const fechaPDFDownload = fecha.toLocaleString('es-ES', this.opciones);
      docResult.save(`${fechaPDFDownload}_movimientos.pdf`);
    });
  }


  //Método que permite exportar los datos a excel
  exportToExcel() {
    // Obtener la tabla desde el DOM
    const table = document.getElementById('htmlTablaExcel');

    // Crear una matriz para almacenar los datos de la tabla
    const rows = [];
    const cells = table.querySelectorAll('td');
    cells.forEach((cell2, index) => {
      if (!rows[Math.floor(index / 6)]) {
        rows[Math.floor(index / 6)] = [];
      }
      rows[Math.floor(index / 6)][index % 6] = cell2.innerText;
    });

    // Crear un libro de Excel y agregar una hoja con los datos de la tabla
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Movimientos');

    //Se obtiene la fecha actual del sistema y se le concatena el nombre para darle un nombre final al archivo descargado
    const fechaPDF = new Date().toISOString()
    const fecha = new Date(fechaPDF);
    this.opciones = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    const fechaPDFDownload = fecha.toLocaleString('es-ES', this.opciones);
    XLSX.writeFile(workbook, `${fechaPDFDownload}_movimientos.xlsx`);
  }


  //Método para cambiar el estado de un guardia
  cambiarEstadoGuardia(guardiaID: number, estado: string) {
    let estadoConsumir = true;
    if (estado == 'ACTIVO') {
      estado = 'INACTIVO';
      estadoConsumir = false;
    }
    this.api.putDatos("/guardia/" + guardiaID + "/" + estadoConsumir, guardiaID).subscribe(data => {
      //this.alertaEmergente.alertaOKSinReload("Se ha cambiado el estado correctamente.")
    }, error => {
      this.alertaEmergente.alertaErrorSinReload("No se pudo procesar su consulta");
    })
  }


  //Método que abre el modal para cargar los datos del guardia
  abrirModalEditarGuardia(modalGuardia, guardia) {
    this.modal.open(modalGuardia, { size: 'lg', centered: true });
    EditarGuardiaComponent.objectGuardia = guardia;
  }

  //Iconos a utilizar
  iconEditar = iconos.faEdit;
  iconEliminar = iconos.faTrash;
  iconPdf = iconos.faFilePdf;
  iconXlsx = iconos.faFileExcel;
  iconGuardia = iconos.faUserShield;

}
