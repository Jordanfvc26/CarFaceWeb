import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChoferService } from './../../services/chofer.service';
import { CargarFotosService } from './../../services/cargar-fotos.service'
import { Router } from '@angular/router';
import { ConsumirServiciosService } from './../../services/consumir-servicios.service';
import { Alerts } from './../../alerts/alerts.component';
import { CargarScriptsJsService } from './../../services/cargar-scripts-js.service';
import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import * as faceapi from 'face-api.js';

/*Para íconos y animación*/
import * as iconos from '@fortawesome/free-solid-svg-icons';
import * as AOS from 'aos';
import { WebcamUtil, WebcamModule, WebcamInitError, WebcamImage, WebcamComponent } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.css', './registro-usuario2.component.css']
})
export class RegistroUsuarioComponent implements OnInit {
  //Creando el viewChild
  @ViewChild('webcamComponent') webcamComponent: WebcamComponent;
  capturedImage: WebcamImage;
  capturedImageurl: string;

  @Output() getPicture = new EventEmitter<WebcamImage>();
  showWebCam = true;
  isCameraExist = true;
  errors: WebcamInitError[] = [];

  //Variables para registrar el número de fotos
  fotosAEnviar: WebcamImage[] = [];
  numFotos = 0;
  formData = new FormData();

  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  constructor(
    private _choferService: ChoferService,
    private _cargarFotos: CargarFotosService,
    private _cargarScripts: CargarScriptsJsService,
    private ruta: Router,
    private api: ConsumirServiciosService,
    public alertaEmergente: Alerts) {
    _cargarScripts.CargarJS(["registro-usuario/registro-usuario"]);
  }

  //Creando el formGroup del usuario a registrar
  formDatosChofer = new FormGroup({
    ci: new FormControl('', Validators.required),
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required),
    licencia: new FormControl('Tipo-licencia', Validators.required),
    correo: new FormControl('', Validators.email),
    clave: new FormControl('', Validators.required)
  })

  ngOnInit(): void {
  }

  //Método que indica que primero debe rellenar todos los campos
  alertaRellenar() {
    if (this.formDatosChofer.value.ci == "" || this.formDatosChofer.value.nombre == "" || this.formDatosChofer.value.apellido == "" || this.formDatosChofer.value.telefono == "" || this.formDatosChofer.value.licencia == "Tipo-licencia") {
      this.alertaEmergente.alertMensajeError("Debe rellenar todos los campos");
    }
  }

  //Método para registrar los datos personales y de inicio de sesión del chofer
  registrarChofer(): void {
    let body: any = {
      "ci": this.formDatosChofer.value.ci,
      "nombre": this.formDatosChofer.value.nombre,
      "apellido": this.formDatosChofer.value.apellido,
      "correo": this.formDatosChofer.value.correo,
      "clave": this.formDatosChofer.value.clave,
      "tipolicencia": this.formDatosChofer.value.licencia,
      "direccion": "Quevedo",
      "telefono": this.formDatosChofer.value.telefono,
    }

    this._choferService.registerChofer(body).subscribe((res) => {
      this.alertaEmergente.alertaMensajeOKSinBtnConfirmar("Registro de información personal exitoso");
      this.iniciarSesion();
    }, error => {
      this.alertaEmergente.alertMensajeError("No se pudo registrar su información en CarFace");
    });
  }

  //Método para iniciar sesión
  iniciarSesion() {
    let headers = new Map();
    headers.set("correo", this.formDatosChofer.value.correo);
    headers.set("clave", this.formDatosChofer.value.clave);

    this.api.postDatos("/sesion/login", null, headers).subscribe(data => {
      sessionStorage.setItem("usuario", data.token);
      sessionStorage.setItem("rol", data.rol)
    }, error => {
      console.log(error);
      this.alertaEmergente.alertMensajeError("Ha ocurrido un error en el servidor");
    })
  }


  //Método que registra las fotos las cuales se almacenan previamente en un vector
  registrarFotos() {
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
        this.alertaEmergente.alertaMensajeOKSinBtnConfirmar("Se ha registrado correctamente en CarFace");
        this.ruta.navigateByUrl('/dashboard');
      }, error => {
        console.log(error)
        this.alertaEmergente.alertMensajeError("No se ha podido registrar su rostro");
      });
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
    await this.loadFaceApi();
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
      this.alertaEmergente.alertaMensajeOKSinBtnConfirmar("Face ID registrado");
      console.log(this.fotosAEnviar);
    }
  }

  //Método que agrega las imágenes al vector
  handleImage(webcamImage: WebcamImage) {
    this.capturedImage = webcamImage;
    this.capturedImageurl=webcamImage.imageAsDataUrl;
  }

  //Método para cambiar de cámara
  cambiarCamara(directionOrDeviceId: boolean | string) {
    this.nextWebcam.next(directionOrDeviceId);
  }

  async loadFaceApi() {
    const MODEL_URL = '/../../../assets/models/';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
    ]);
    console.log("MODELOS CARGADOS");
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