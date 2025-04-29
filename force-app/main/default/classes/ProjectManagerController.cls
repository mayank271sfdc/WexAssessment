public with sharing class ProjectManagerController {

    @AuraEnabled
    public static Id saveProject(Project__c projectRecord) {
        upsert projectRecord;
        return projectRecord.Id;
    }

    @AuraEnabled
    public static List<Milestone__c> saveMilestones(List<Milestone__c> milestoneRecords) {
        upsert milestoneRecords;
        return milestoneRecords;
    }

    @AuraEnabled
    public static List<To_Do_Item__c> saveToDos(List<To_Do_Item__c> toDoRecords) {
        upsert toDoRecords;
        return toDoRecords;
    }

    @AuraEnabled(cacheable=true)
    public static List<Project__c> getProjectSummary() {
        return [
            SELECT Id, Name, Status__c, Calculate__c,
                (SELECT Id, Name, Due_Date__c, Status__c, Calculate__c,
                    (SELECT Id, Name, Due_Date__c, Status__c FROM To_Do_Items__r)
                FROM Milestones__r)
            FROM Project__c
        ];
    }
}
