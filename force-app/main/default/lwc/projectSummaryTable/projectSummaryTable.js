import { LightningElement, wire, track } from 'lwc';
import getProjectSummary from '@salesforce/apex/ProjectManagerController.getProjectSummary';

const COLUMNS = [
    {
        label: 'Project Name',
        fieldName: 'projectUrl',
        type: 'url',
        typeAttributes: { label: { fieldName: 'projectName' }, target: '_blank' }
    },
    { label: 'Project Status', fieldName: 'projectStatus' },
    { label: 'Project Calculate', fieldName: 'projectCalculate' },
    {
        label: 'Milestone Name',
        fieldName: 'milestoneUrl',
        type: 'url',
        typeAttributes: { label: { fieldName: 'milestoneName' }, target: '_blank' }
    },
    { label: 'Milestone Due Date', fieldName: 'milestoneDueDate', type: 'date' },
    { label: 'Milestone Status', fieldName: 'milestoneStatus' },
    { label: 'Milestone Calculate', fieldName: 'milestoneCalculate' },
    {
        label: 'To-Do Name',
        fieldName: 'todoUrl',
        type: 'url',
        typeAttributes: { label: { fieldName: 'todoName' }, target: '_blank' }
    },
    { label: 'To-Do Due Date', fieldName: 'todoDueDate', type: 'date' },
    { label: 'To-Do Status', fieldName: 'todoStatus' }
];

export default class ProjectSummaryTable extends LightningElement {
    @track flatProjectData = [];
    @track error;
    columns = COLUMNS;

    get noData() {
        return this.flatProjectData.length === 0 && !this.error;
    }    

    @wire(getProjectSummary)
    wiredSummary({ error, data }) {
        if (data) {
            this.flatProjectData = [];
            data.forEach(project => {
                const milestones = project.Milestones__r || [];
                if (milestones.length > 0) {
                    milestones.forEach(milestone => {
                        const todos = milestone.To_Do_Items__r || [];
                        if (todos.length > 0) {
                            todos.forEach(todo => {
                                this.flatProjectData.push({
                                    Id: todo.Id,
                                    projectName: project.Name || '',
                                    projectUrl: `/lightning/r/Project__c/${project.Id}/view`,
                                    projectStatus: project.Status__c || '',
                                    projectCalculate: project.Calculate__c || '',
                                    milestoneName: milestone.Name || '',
                                    milestoneUrl: `/lightning/r/Milestone__c/${milestone.Id}/view`,
                                    milestoneDueDate: milestone.Due_Date__c || '',
                                    milestoneStatus: milestone.Status__c || '',
                                    milestoneCalculate: milestone.Calculate__c || '',
                                    todoName: todo.Name || '',
                                    todoUrl: `/lightning/r/To_Do_Item__c/${todo.Id}/view`,
                                    todoDueDate: todo.Due_Date__c || '',
                                    todoStatus: todo.Status__c || ''
                                });
                            });
                        } else {
                            this.flatProjectData.push({
                                Id: milestone.Id,
                                projectName: project.Name || '',
                                projectUrl: `/lightning/r/Project__c/${project.Id}/view`,
                                projectStatus: project.Status__c || '',
                                projectCalculate: project.Calculate__c || '',
                                milestoneName: milestone.Name || '',
                                milestoneUrl: `/lightning/r/Milestone__c/${milestone.Id}/view`,
                                milestoneDueDate: milestone.Due_Date__c || '',
                                milestoneStatus: milestone.Status__c || '',
                                milestoneCalculate: milestone.Calculate__c || '',
                                todoName: '',
                                todoDueDate: '',
                                todoStatus: ''
                            });
                        }
                    });
                } else {
                    this.flatProjectData.push({
                        Id: project.Id,
                        projectName: project.Name || '',
                        projectUrl: `/lightning/r/Project__c/${project.Id}/view`,
                        projectStatus: project.Status__c || '',
                        projectCalculate: project.Calculate__c || '',
                        milestoneName: '',
                        milestoneDueDate: '',
                        milestoneStatus: '',
                        milestoneCalculate: '',
                        todoName: '',
                        todoDueDate: '',
                        todoStatus: ''
                    });
                }
            });
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.flatProjectData = [];
        }
    }
}
