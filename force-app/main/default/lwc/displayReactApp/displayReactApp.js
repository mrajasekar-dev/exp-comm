import { LightningElement } from 'lwc';
import REACT_APP_RESOURCE from '@salesforce/resourceUrl/MockReactJSApplication';

export default class DisplayReactApp extends LightningElement {
    reactAppUrl = `${REACT_APP_RESOURCE}/index.html`;
}
