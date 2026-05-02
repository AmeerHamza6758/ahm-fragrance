import Swal, { SweetAlertPosition } from "sweetalert2"
const errorMessages='Something went wrong'
export const successToaster = (text: string, position: SweetAlertPosition = 'top-right') => {
    Swal.fire({
        text,
        icon: 'success',
        background: 'white',
        color: 'var(--color-text-subtle)',
        confirmButtonColor: 'var(--primary)',
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
        background: 'white',
        color: 'var(--color-text-subtle)',
        confirmButtonColor: 'var(--primary)',
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
        background: 'white',
        color: 'var(--color-primary)',
        confirmButtonColor: 'var(--primary)',
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
        background: 'white',
        color: 'var(--color-text-subtle)',
        confirmButtonColor: 'var(--primary)',
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
        background: 'white',
        color: 'var(--color-text-subtle)',
        showCancelButton: true,
        confirmButtonColor: 'rgb(44 70 87)',
        cancelButtonColor: '#CED4DA',
        confirmButtonText,
        cancelButtonText,
    });
}
export const priorDownloadConfirmationPopup = async (title: string = 'Are you sure you want to download?', text?: string) => {
    return Swal.fire({
        title,
        icon: 'question',
        background: 'var(--alert-popup-bg)',
        color: 'var(--black-text)',
        showCancelButton: true,
        confirmButtonColor: 'var(--primary)',
        cancelButtonColor: 'var(--reset-button-bg)',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
    });
}
export const customConfirmationPopup = async (title: string, confirmButtonText: string, cancelButtonText: string) => {
    return Swal.fire({
        title,
        icon: 'question',
        background: 'var(--alert-popup-bg)',
        color: 'var(--black-text)',
        showCancelButton: true,
        confirmButtonColor: 'var(--primary)',
        cancelButtonColor: 'var(--reset-button-bg)',
        confirmButtonText,
        cancelButtonText,
        allowOutsideClick: false
    });
}

export const infoPopup = async (title: string = 'infoMessages.featureNotAvailable', text?: string) => {
    return Swal.fire({
        title,
        icon: 'info',
        background: 'var(--alert-popup-bg)',
        color: 'var(--black-text)',
        confirmButtonColor: 'var(--primary)',
        confirmButtonText: 'Ok',
    });
}

export const followEventPopup = async (title: string = 'Follow Event') => {
    return Swal.fire({
        title,
        text: "Are you sure you want to follow up this event?",
        icon: 'question',
        background: 'white',
        showCancelButton: true,
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
        background: 'white',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        allowOutsideClick: false,
    });
};