import Swal, { SweetAlertPosition } from "sweetalert2"
const errorMessages='Something went wrong'
export const successToaster = (text: string, position: SweetAlertPosition = 'top-right') => {
    Swal.fire({
        text,
        icon: 'success',
        background: '#ffffff',
        color: '#6b6460',
        confirmButtonColor: '#7e525c',
        showConfirmButton: false,
        toast: true,
        timerProgressBar: true,
        position,
        timer: 3000,
    })
}

export const warningToaster = (text: string, position: SweetAlertPosition = 'top-right') => {
    Swal.fire({
        text,
        icon: 'warning',
        background: '#ffffff',
        color: '#6b6460',
        confirmButtonColor: '#7e525c',
        showConfirmButton: false,
        toast: true,
        timerProgressBar: true,
        position,
        timer: 3000,
    })
}

export const errorToaster = (text: string, position: SweetAlertPosition = 'top-right') => {
    Swal.fire({
        text: text ?? errorMessages,
        icon: 'error',
        background: '#ffffff',
        color: '#7e525c',
        confirmButtonColor: '#7e525c',
        showConfirmButton: false,
        toast: true,
        timerProgressBar: true,
        position,
        timer: 3000,
    })
}

export const errorToasterAutoClose = (title: string, position: SweetAlertPosition = 'top-right') => {
    Swal.fire({
        title,
        icon: 'error',
        background: '#ffffff',
        color: '#6b6460',
        confirmButtonColor: '#7e525c',
        showConfirmButton: false,
        toast: true,
        timerProgressBar: true,
        timer: 5000,
        position
    })
}

export const confirmationPopup = async (title: string = 'Are you sure you want to do this?', confirmButtonText = 'Yes', cancelButtonText = 'No') => {
    return Swal.fire({
        title,
        icon: 'question',
        background: '#ffffff',
        color: '#1c1c19',
        showCancelButton: true,
        confirmButtonColor: '#7e525c',
        cancelButtonColor: '#CED4DA',
        confirmButtonText,
        cancelButtonText,
    });
}
export const priorDownloadConfirmationPopup = async (title: string = 'Are you sure you want to download?', text?: string) => {
    return Swal.fire({
        title,
        icon: 'question',
        background: '#ffffff',
        color: '#1c1c19',
        showCancelButton: true,
        confirmButtonColor: '#7e525c',
        cancelButtonColor: '#d1c3c1',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
    });
}
export const customConfirmationPopup = async (title: string, confirmButtonText: string, cancelButtonText: string) => {
    return Swal.fire({
        title,
        icon: 'question',
        background: '#ffffff',
        color: '#1c1c19',
        showCancelButton: true,
        confirmButtonColor: '#7e525c',
        cancelButtonColor: '#d1c3c1',
        confirmButtonText,
        cancelButtonText,
        allowOutsideClick: false
    });
}

export const infoPopup = async (title: string = 'infoMessages.featureNotAvailable', text?: string) => {
    return Swal.fire({
        title,
        icon: 'info',
        background: '#ffffff',
        color: '#1c1c19',
        confirmButtonColor: '#7e525c',
        confirmButtonText: 'Ok',
    });
}

export const followEventPopup = async (title: string = 'Follow Event') => {
    return Swal.fire({
        title,
        text: "Are you sure you want to follow up this event?",
        icon: 'question',
        background: '#ffffff',
        color: '#1c1c19',
        showCancelButton: true,
        confirmButtonColor: '#7e525c',
        cancelButtonColor: '#d1c3c1',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        allowOutsideClick: false,
    });
};

export const shareEventPopup = async (title: string = 'Sign Up Event ') => {
    return Swal.fire({
        title,
        text: "Are you sure you want to share this event for sign up?",
        icon: 'question',
        background: '#ffffff',
        color: '#1c1c19',
        showCancelButton: true,
        confirmButtonColor: '#7e525c',
        cancelButtonColor: '#d1c3c1',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        allowOutsideClick: false,
    });
};