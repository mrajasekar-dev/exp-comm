import { LightningElement } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import STATIC_RESOURCE_URL from '@salesforce/resourceUrl/AccordionApp';

export default class AccordionApp extends LightningElement {
    iframeUrl = STATIC_RESOURCE_URL + '/mock-static-reactjs/index.html'; // Adjust if your HTML is nested within the ZIP

    renderedCallback() {
        Promise.all([
            loadScript(this, STATIC_RESOURCE_URL + '/mock-static-reactjs/js/app.js'),
            loadStyle(this, STATIC_RESOURCE_URL + '/mock-static-reactjs/css/style.css')
        ])
        .then(() => console.log('Files loaded'))
        .catch(error => console.error(error));
    }
}
