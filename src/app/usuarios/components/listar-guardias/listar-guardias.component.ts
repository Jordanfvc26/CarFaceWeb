import { EliminarGuardiaComponent } from './../eliminar-guardia/eliminar-guardia.component';
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
        if (element.estado == true){
          this.estado = "ACTIVO";
        }
        else{
          this.estado = "INACTIVO";
        }
        let guardia = {
          "id": element.id,
          "ci": element.ci,
          "nombre": element.nombre,
          "correo": element.correo,
          "empresa": element.empresa,
          "estado": this.estado
        }
        //Agregando los datos finaes al vector
        this.guardias.push(guardia);
      });
    }, error => {
      console.log(error);
      this.alertaEmergente.alertMensajeError("No se pudieron cargar los datos :(");
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

  //Método para eliminar a un guardia
  eliminarGuardia(modalEliminarGuardia: any, guardiaID: any){
    this.modal.open(modalEliminarGuardia, { size: 'lg', centered: true });
    //Pasamos el ID de la tabla a eliminar, al componente de Eliminar.
    EliminarGuardiaComponent.guardiaIDEliminar = guardiaID;
    console.log(guardiaID);
  }


  //Iconos a utilizar
  iconEditar = iconos.faEdit;
  iconEliminar = iconos.faTrash;

  iconPdf = iconos.faFilePdf;
  iconXlsx = iconos.faFileExcel;
  iconGuardia = iconos.faUserShield;

}
