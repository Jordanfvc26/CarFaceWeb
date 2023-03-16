import { Alerts } from './../../alerts/alerts.component';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { Router } from '@angular/router';
import { CargarFotosService } from './../../services/cargar-fotos.service';
import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';

/*Para el reconocimiento facial*/
import * as faceapi from 'face-api.js';

/*Para íconos y animación*/
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { WebcamUtil, WebcamModule, WebcamInitError, WebcamImage, WebcamComponent } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-registro-rostro',
  templateUrl: './registro-rostro.component.html',
  styleUrls: ['./registro-rostro.component.css']
})
export class RegistroRostroComponent implements OnInit {
  //Creando el viewChild
  @ViewChild('webcamComponent') webcamComponent: WebcamComponent;
  capturedImage: WebcamImage;
  capturedImageurl: string;

  @Output() getPicture = new EventEmitter<WebcamImage>();
  showWebCam = true;
  isCameraExist = true;
  errors: WebcamInitError[] = [];
  estadoSpinner: boolean = false;

  //Variables para registrar el número de fotos
  fotosAEnviar: WebcamImage[] = [];
  numFotos = 0;
  formData = new FormData();
  tomoFoto = false;

  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  constructor(
    private _cargarFotos: CargarFotosService,
    private ruta: Router,
    private api: ConsumirServiciosService,
    public alertaEmergente: Alerts
  ) { }

  ngOnInit(): void {
    this.estadoSpinner = true;
    this.alertaEmergente.alertaWarningSinReloadBtn("Alerta", "A continuación registre su rostro para acceder a todas las funciones de CarFace")
  }


  //Método que registra las fotos las cuales se almacenan previamente en un vector
  registrarFotos() {
    if(this.tomoFoto = false){
      this.alertaEmergente.alertaErrorSinReloadBtn("Primero debe capturar su rostro");
    }
    else{
      this.estadoSpinner = false;
    let headers = new Map();
    const files: File[] = [];
    for (let i = 0; i < this.fotosAEnviar.length; i++) {
      const imgBlob = this.dataURItoBlob(this.fotosAEnviar[i].imageAsDataUrl);
      const file = new File([imgBlob], 'imagen_' + i + '.jpg', { type: imgBlob.type });
      files.push(file);
    }
    // Crea un objeto FormData y agrega cada archivo al campo 'files'
    for (let i = 0; i < files.length; i++) {
      this.formData.append('files', files[i]);
    }

    //Compara lo del formData y procede a enviar a la API
    if (this.formData.getAll("files") != null) {
      this._cargarFotos.putDatos("/chofer/fotos", this.formData).subscribe(data => {
        this.estadoSpinner = true;
        this.alertaEmergente.alertaOKConReload("Se ha registrado correctamente en CarFace");
        this.ruta.navigateByUrl('/dashboard');
      }, error => {
        console.log(error)
        this.alertaEmergente.alertaErrorSinReload("No se ha podido registrar su rostro");
        this.estadoSpinner = true;
      });
    }
    }
  }


  //Método complementario al de registroFotos() para crear los files en constante
  private dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }


  //Toma la foto y las agrega a un vector
  async capturarFotos() {
    this.tomoFoto = true;
    this.estadoSpinner = false;
    await this.loadFaceApi();
    this.estadoSpinner = true;
    //Se limpia el vector antes de volver a llenarlo
    this.fotosAEnviar.splice(0, this.fotosAEnviar.length);
    for (let index = 0; index < 10; index++) {
      // Espera 1,5 segundos antes de tomar la foto
      await new Promise(resolve => setTimeout(resolve, 1500));
      this.webcamComponent.takeSnapshot();

      // Detecta un rostro en la foto
      const img = new Image();
      img.src = this.capturedImage.imageAsDataUrl;
      const detection = await faceapi.detectSingleFace(img);

      // Si se detectó un rostro, agrega la foto al vector de fotos a enviar
      if (detection) {
        this.fotosAEnviar.push(this.capturedImage);
        this.numFotos = index + 1;
      } else {
        index = index - 1;
      }
    }
    if (this.numFotos == 10) {
      this.alertaEmergente.alertaOKSinReload("Face ID capturado");
      console.log(this.fotosAEnviar);
    }
  }

  //Método que agrega las imágenes al vector
  handleImage(webcamImage: WebcamImage) {
    this.capturedImage = webcamImage;
    this.capturedImageurl = webcamImage.imageAsDataUrl;
  }

  //Método para cambiar de cámara
  cambiarCamara(directionOrDeviceId: boolean | string) {
    this.nextWebcam.next(directionOrDeviceId);
  }

  async loadFaceApi() {
    this.estadoSpinner = false;
    const MODEL_URL = '/../../../assets/models/';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
    ]);
    console.log("MODELOS CARGADOS");
    this.estadoSpinner = true;
  }

  //Método para encender/apagar la cámara
  onOffCamara() {
    this.showWebCam = !this.showWebCam;
  }

  //Método que se muestra si existe algún error con la cámara
  handleInitError(error: WebcamInitError) {
    this.errors.push(error);
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }


  //Iconos a utilizar
  iconCedula = iconos.faIdCard;
  iconCamara = iconos.faVideo;
  iconCambiarCamara = iconos.faCamera;
  iconOnOffCamara = iconos.faVideoSlash;


}
