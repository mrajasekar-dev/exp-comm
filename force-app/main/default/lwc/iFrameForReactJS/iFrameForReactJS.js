import { LightningElement } from 'lwc';
import myReactApp from '@salesforce/resourceUrl/mockReactJs';

export default class IFrameForReactJS extends LightningElement {
    reactAppUrl = `${myReactApp}/index.html`;
}