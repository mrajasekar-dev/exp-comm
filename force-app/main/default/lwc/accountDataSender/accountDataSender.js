import { LightningElement } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AccountDataSender extends LightningElement {
    recordId;

    connectedCallback() {
        this.recordId = this.getRecordIdFromUrl();
        this.sendDataToReactApp();
    }

    async sendDataToReactApp() {
        try {
            const reactAppUrl = 'https://mock-reactjs.vercel.app/?accountId='+this.recordId;
            window.open(reactAppUrl, '_blank');
        } catch (error) {
            console.error('Error sending data to React app:', error);
            this.showToast('Error', error.message || 'Failed to send data to React app', 'error');
        } finally {
            this.dispatchEvent(new CloseActionScreenEvent());
        }
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }

    getRecordIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const recordId = urlParams.get('recordId');
        console.log('Extracted Record ID:', recordId); // For debugging
        return recordId;
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}