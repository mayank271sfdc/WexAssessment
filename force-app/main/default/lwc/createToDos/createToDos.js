import { LightningElement, api, track } from 'lwc';
import saveToDos from '@salesforce/apex/ProjectManagerController.saveToDos';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CreateToDos extends LightningElement {
    @api milestones = [];
    @track toDos = [];

    statusOptions = [
        { label: 'Not Started', value: 'Not Started' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Completed', value: 'Completed' },
    ];

    get milestoneOptions() {
        return this.milestones.map(ms => ({
            label: ms.name,
            value: ms.id
        }));
    }

    connectedCallback() {
        this.addToDo(); // Start with 1 to-do
    }

    addToDo() {
        this.toDos.push({
            name: '',
            milestoneId: '',
            status: '',
            dueDate: ''
        });
    }

    handleNameChange(event) {
        const index = event.target.dataset.index;
        this.toDos[index].name = event.target.value;
    }
    
    handleMilestoneChange(event) {
        const index = event.target.dataset.index;
        this.toDos[index].milestoneId = event.detail.value;
    }
    
    handleStatusChange(event) {
        const index = event.target.dataset.index;
        this.toDos[index].status = event.detail.value;
    }
    
    handleDueDateChange(event) {
        const index = event.target.dataset.index;
        this.toDos[index].dueDate = event.target.value;
    }

    saveToDos() {
        const toDoRecords = this.toDos.map(todo => ({
            Name: todo.name,
            Milestone__c: todo.milestoneId,
            Status__c: todo.status,
            Due_Date__c: todo.dueDate
        }));

        saveToDos({ toDoRecords: toDoRecords })
            .then(() => {
                this.dispatchEvent(new ShowToastEvent({
                    title: "Success",
                    message: "Project, Milestone, and To-Do Items Successfully Created!",
                    variant: "success"
                }));

                const nextEvent = new CustomEvent('save');
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
