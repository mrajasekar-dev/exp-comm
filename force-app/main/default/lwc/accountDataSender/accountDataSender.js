// lwc/accountDataSender/accountDataSender.js
import { LightningElement, api } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAccountDataForReactApp from '@salesforce/apex/AccountDataController.getAccountDataForReactApp';

export default class AccountDataSender extends LightningElement {
    recordId;

    connectedCallback() {
        this.recordId = this.getRecordIdFromUrl();
        console.log('Record ID from URL:', this.recordId); // For debugging
        if (this.recordId) {
            this.sendDataToReactApp();
        } else {
            console.error('No record ID found in URL');
            this.showToast('Error', 'No record ID found', 'error');
            this.dispatchEvent(new CloseActionScreenEvent());
        }
    }

    getRecordIdFromUrl() {
        let url = window.location.href;
        let recordId = null;
        
        // Check for classic URL format
        let match = url.match(/\/([a-zA-Z0-9]{15}|[a-zA-Z0-9]{18})/);
        if (match) {
            recordId = match[1];
        } else {
            // Check for Lightning URL format
            const urlParams = new URLSearchParams(window.location.search);
            recordId = urlParams.get('recordId') || urlParams.get('id');
        }

        return recordId;
    }

    async sendDataToReactApp() {
        try {
            const accountData = await getAccountDataForReactApp({ accountId: this.recordId });
            const parsedData = JSON.parse(accountData);
            
            if (parsedData.error) {
                throw new Error(parsedData.error);
            }

            const reactAppUrl = `https://mock-reactjs.vercel.app/?accountData=${accountData}`;
            window.open(reactAppUrl, '_blank');
            this.showToast('Success', 'React app opened with account data', 'success');
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
}