import { LightningElement, track } from 'lwc';

export default class DisplayReactApp extends LightningElement {
    // URL of the hosted application on Vercel
    @track appUrl = 'https://your-app.vercel.app';

    // Handle iframe load event (Optional, for further logic)
    handleIframeLoad() {
        console.log('Iframe loaded successfully');
    }

    // Example method to fetch data from server
    handleFetchData() {
        const url = 'https://your-app.vercel.app/api/data'; // Replace with your API endpoint

        // Fetch data using the Fetch API
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Data fetched from server:', data);
            // You can process the data and update component properties as needed
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    }
}
