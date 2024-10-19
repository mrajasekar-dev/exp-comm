import { LightningElement, track } from 'lwc';

export default class OppsAndQuotes extends LightningElement {
    @track iframeSrc;

    connectedCallback() {
        const accountId = this.getAccountIdFromUrl();
        console.log('Account ID from URL:', accountId);

        if (accountId) {
            this.iframeSrc = `https://mock-reactjs.vercel.app/?accountId=${accountId}`;
        } else {
            console.error('Account ID is not defined in the URL');
        }
    }

    getAccountIdFromUrl() {
        const pathArray = window.location.pathname.split('/');
        const recordIdIndex = pathArray.indexOf('Account') + 1;
        return pathArray[recordIdIndex];
    }
}
