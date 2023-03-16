import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { Alerts } from './../../alerts/alerts.component';
import { Component, OnInit } from '@angular/core';
/*Para los íconos*/
import * as iconos from '@fortawesome/free-solid-svg-icons';


/*Para generar PDF y Excel*/
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
/*Para la ventana emergente*/
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PageEvent } from '@angular/material/paginator';
import { MovimientosIdComponent } from '../movimientos-id/movimientos-id.component';

@Component({
  selector: 'app-listar-choferes',
  templateUrl: './listar-choferes.component.html',
  styleUrls: ['./listar-choferes.component.css']
})
export class ListarChoferesComponent implements OnInit {

  //Variables y objetos a utilizar
  choferes: any[] = [];
  opciones: any;
  fechaTemp: any;
  estadoSpinner = false;
  //Para la paginación
  pageSize = 7;
  desde = 0;
  hasta = 7;

  choferesABuscar: any[] = [];
  opcionFiltro = "ci";

  constructor(
    public alertaEmergente: Alerts,
    private api: ConsumirServiciosService,
    public modal: NgbModal
  ) { }

  //Form que captura la etiqueta select para obtener el filtro
  formSelect = new FormGroup({
    filtro: new FormControl('ci', Validators.required),
  })

  ngOnInit(): void {
    this.estadoSpinner = false;
    this.api.getDatos("/chofer/all").subscribe(data => {
      data.forEach(element => {
        const fechatTemp = element.fechacreacion;
          const fecha = new Date(fechatTemp);
          //Dando formato a la fecha
          this.opciones = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          };
          const fechaFormateada = fecha.toLocaleString('es-ES', this.opciones);

        let chofer = {
          "id": element.id,
          "ci": element.ci,
          "nombre": element.nombre,
          "apellido": element.apellido,
          "correo": element.correo,
          "telefono": element.telefono,
          "licencia": element.licencia,
          "fechacreacion": fechaFormateada
        }
        //Agregando los datos finales al vector
        this.choferes.push(chofer);
        this.estadoSpinner = true;
      });
    }, error => {
      console.log(error);
      this.alertaEmergente.alertaErrorSinReloadBtn("No se pudieron cargar los registros");
      this.estadoSpinner = true;
    })
  }

  //Método que permite cambiar de una página a otra en las tablas
  cambiarPagina(e: PageEvent) {
    console.log(e);
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

  //Método para imprimir los movimientos del chofer, en PDF
  downloadPDF() {
    this.estadoSpinner = false;
    //Se extrae la información a plasmar en el PDF
    const DATA = document.getElementById('htmlTablaPDF');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    //Datos para el encabezado
    const empresa = 'CarFace: Listado de choferes registrados';
    const fehcaEmision = 'Fecha de emisión: ' + this.obtenerFechaActual();
    const usuario = 'Usuario: Administrador';
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');
      //Agregar image Canvas al PDF
      const bufferX = 15;
      const bufferY = 90;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');

      // Agregamos el encabezado
      doc.setFontSize(18);
      doc.text(empresa, 15, 30); // Posicionamos el texto a 15,30 (X,Y)
      doc.setFontSize(11);
      doc.text(fehcaEmision, 15, 50);
      doc.setFontSize(11);
      doc.text(usuario, 15, 70);
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
      this.estadoSpinner = true;
    });
  }


  //Método que permite exportar los datos a excel
  exportToExcel() {
    this.estadoSpinner = false;
    // Obtener la tabla desde el DOM
    const table = document.getElementById('htmlTablaExcel');
    // Crear una matriz para almacenar los datos de la tabla
    const rows = [];
    const cells = table.querySelectorAll('td');
    cells.forEach((cell2, index) => {
      if (!rows[Math.floor(index / 7)]) {
        rows[Math.floor(index / 7)] = [];
      }
      rows[Math.floor(index / 7)][index % 7] = cell2.innerText;
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
    this.estadoSpinner = true;
  }


  //Método que abre el modal para cargar los datos del guardia
  abrirModalVerMovimientosChofer(modalVerMovimientos, idChofer) {
    this.modal.open(modalVerMovimientos, { size: 'xl', centered: true });
    MovimientosIdComponent.idChofer = idChofer;
  }

  //Método que obtiene la fecha actual para mostrarla en el archivo PDF
  obtenerFechaActual(): string {
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1; //Los meses van del 0 al 11, por eso se suma 1
    const anio = fechaActual.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }


  //Iconos a utilizar
  iconVerDetalles = iconos.faEye;
  iconPdf = iconos.faFilePdf;
  iconXlsx = iconos.faFileExcel;
  iconChofer = iconos.faUser;
}