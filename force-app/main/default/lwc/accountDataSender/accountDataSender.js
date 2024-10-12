// lwc/accountDataSender/accountDataSender.js
import { LightningElement, api } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAccountDataForReactApp from '@salesforce/apex/AccountDataController.getAccountDataForReactApp';

export default class AccountDataSender extends LightningElement {
    recordId;

    connectedCallback() {
        this.recordId = this.getRecordIdFromUrl();
        this.sendDataToReactApp();
    }

    async sendDataToReactApp() {
        try {
            const accountData = await getAccountDataForReactApp({ accountId: this.recordId });
            const reactAppUrl = 'https://mock-reactjs.vercel.app/';
            
            // Open the React app in a new window
            const reactWindow = window.open(reactAppUrl, '_blank');
            
            // Wait for the React app to load
            reactWindow.onload = () => {
                // Post the data to the React app
                reactWindow.postMessage({ type: 'SALESFORCE_DATA', payload: accountData }, '*');
            };

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

    getRecordIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const recordId = urlParams.get('recordId');
        console.log('Extracted Record ID:', recordId); // For debugging
        return recordId;
    }

    async sendDataToReactApp() {
        try {
            const accountData = await getAccountDataForReactApp({ accountId: this.recordId });
            console.log('Account data received:', accountData);

            const reactAppUrl = 'https://mock-reactjs.vercel.app/';
            console.log('Opening React app:', reactAppUrl);
            
            const reactWindow = window.open(reactAppUrl, '_blank');
            
            if (!reactWindow) {
                throw new Error('Unable to open React app window. Please check your pop-up blocker settings.');
            }

            reactWindow.onload = () => {
                console.log('React app window loaded');
                reactWindow.postMessage({ type: 'SALESFORCE_DATA', payload: accountData }, '*');
                console.log('Data posted to React app');
            };

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