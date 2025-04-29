import { LightningElement, api, track } from 'lwc';
import saveMilestones from '@salesforce/apex/ProjectManagerController.saveMilestones';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CreateMilestones extends LightningElement {
    @api projectId;
    @track milestones = [];

    connectedCallback() {
        this.addMilestone();
    }

    addMilestone() {
        this.milestones = [
            ...this.milestones,
            {
                name: '',
                dueDate: ''
            }
        ];
    }

    handleNameChange(event) {
        const index = event.target.dataset.index;
        this.milestones[index].name = event.target.value;
    }

    handleDueDateChange(event) {
        const index = event.target.dataset.index;
        this.milestones[index].dueDate = event.target.value;
    }

    saveMilestones() {
        const milestoneRecords = this.milestones.map(milestone => ({
            Name: milestone.name,
            Due_Date__c: milestone.dueDate,
            Project__c: this.projectId
        }));

        saveMilestones({ milestoneRecords: milestoneRecords })
            .then(result => {

                const milestoneIds = result.map(m => ({ id: m.Id, name: m.Name }));
                const nextEvent = new CustomEvent('next', { detail: milestoneIds });
                this.dispatchEvent(nextEvent);
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: "Error",
                    message: error.body.message || 'Error saving milestones.',
                    variant: "error"
                }));
            });
    }
}
