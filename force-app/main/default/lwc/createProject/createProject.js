import { LightningElement, track } from 'lwc';
import saveProject from '@salesforce/apex/ProjectManagerController.saveProject';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CreateProject extends LightningElement {
    @track projectName = '';

    handleNameChange(event) {
        this.projectName = event.target.value;
    }

    saveProject() {
        const projectRecord = {
            Name: this.projectName
        };

        saveProject({ projectRecord: projectRecord })
            .then(result => {
                const nextEvent = new CustomEvent('next', { detail: result });
                this.dispatchEvent(nextEvent);
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: "Error",
                    message: error.body.message,
                    variant: "error"
                }));
            });
    }
}
