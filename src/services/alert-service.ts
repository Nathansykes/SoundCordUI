

export default class AlertService {
    public static showAlert(message: string, type: string = 'primary', timeMs: number = 5000) : void {
        const alertContainer = document.getElementById('alert-container');
        const alert = document.createElement('div');
        const id = `alert-id-${Math.random()}`;
        alert.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert" id=${id}>`,
            `   <div>${message}</div>`,
            `   <button type="button" class="btn-close" data-bs-dismiss="alert" id="close-${id}" aria-label="Close"></button>`,
            '</div>'
        ].join('')

        alertContainer!.appendChild(alert);
        setTimeout(() => {
            const ele = document.getElementById('close-' + id);
            ele?.click();
        }, timeMs);
    }
}