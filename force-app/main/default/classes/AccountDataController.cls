public with sharing class AccountDataController {
    @AuraEnabled
    public static String getAccountDataForReactApp(Id accountId) {
        try {
            // Fetch Account details
            Account acc = [SELECT Id, Name, Industry, OwnerId, Owner.Name, BillingCity, BillingState, BillingCountry 
                           FROM Account WHERE Id = :accountId LIMIT 1];

            if (acc == null) {
                return JSON.serialize(new Map<String, Object>{
                    'error' => 'Account not found'
                });
            }

            // Fetch related Opportunities
            List<Opportunity> opps = new List<Opportunity>();
            opps = [SELECT Id, Name, StageName, Amount, CloseDate, OwnerId, Owner.Name
                                      FROM Opportunity WHERE AccountId = :accountId];

            // Fetch related Quotes and Quote Line Items
            List<Quote__c> quotes = new List<Quote__c>();
            quotes = [SELECT Id, Name, Status__c, Grand_Total__c, Quote_Valid_Until__c,
                                     (SELECT Id, Name, Product__r.Name, Quantity__c, Unit_Price__c, Total_Price__c
                                      FROM Quote_Line_Items__r)
                                     FROM Quote__c WHERE Account__c = :accountId];

            // Create a wrapper object to hold all the data
            Map<String, Object> result = new Map<String, Object>();
            result.put('Account', acc);
            result.put('Opportunities', opps);
            result.put('Quotes', quotes);

            return JSON.serialize(result);
        } catch (Exception e) {
            return JSON.serialize(new Map<String, Object>{
                'error' => 'Error fetching account data: ' + e.getMessage()
            });
        }
    }
}