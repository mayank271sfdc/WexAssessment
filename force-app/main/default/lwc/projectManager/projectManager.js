import { LightningElement, track } from 'lwc';

export default class ProjectManager extends LightningElement {
    @track showCreateProject = true;
    @track showCreateMilestones = false;
    @track showCreateToDos = false;
    @track showSummary = true;

    @track projectId;
    @track milestones = [];

    handleNextFromProject(event) {
        this.projectId = event.detail;
        this.showCreateProject = false;
        this.showCreateMilestones = true;
        this.showSummary = true;
    }

    handleNextFromMilestones(event) {
        this.milestones = event.detail;
        this.showCreateMilestones = false;
        this.showCreateToDos = true;
        this.showSummary = true;
    }

    handleNextFromToDos() {
        this.showCreateToDos = false;
        this.showSummary = true;
    }
}
