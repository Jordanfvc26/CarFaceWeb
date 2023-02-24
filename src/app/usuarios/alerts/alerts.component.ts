/*Importamos la librería de SweetAlert2 para poder usar las alertas emergentes personalizadas*/
import Swal from 'sweetalert2'

export class Alerts {

    //Método que muestra una alerta con un mensaje de estado OK
    public alertaMensajeOK(mensaje: string) {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: mensaje,
            showConfirmButton: true,
        }).then((result) => {
            window.location.reload();
        })
    }

    //Método que muestra una alerta con un mensaje de estado ERROR
    public alertMensajeError(mensaje: string) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: mensaje,
            showConfirmButton: true,
        })
    }

    //Método que muestra alerta con un mensaje de estado OK, sin recargar la página
    public alertaMensajeOKSinRecargar(mensaje: string) {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: mensaje,
            showConfirmButton: true,
        })
    }
}