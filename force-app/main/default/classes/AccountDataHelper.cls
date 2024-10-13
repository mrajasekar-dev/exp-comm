public with sharing class AccountDataHelper {
    public static AccountDataResponse getAccountData(String accountIdStr) {
        Id accountId = Id.valueOf(accountIdStr);
        AccountDataResponse response = new AccountDataResponse();
        
        try {
            List<Opportunity> opportunities = [
                SELECT Id, Name, StageName, Probability, CloseDate, Amount, Description, CreatedById, LastModifiedById, OwnerId, Type, LeadSource, ExpectedRevenue
                FROM Opportunity
                WHERE AccountId = :accountId
            ];
            
            Map<Id, List<Quote__c>> oppToQuotes = new Map<Id, List<Quote__c>>();
            List<Quote__c> quotes = [
                SELECT Id, Name, Status__c, Quote_Number__c, Grand_Total__c, Opportunity__c, Description__c, Discount__c, GST__c, Quote_Valid_From__c, Quote_Valid_Until__c
                FROM Quote__c
                WHERE Opportunity__c IN :opportunities
            ];
            
            for (Quote__c quote : quotes) {
                if (!oppToQuotes.containsKey(quote.Opportunity__c)) {
                    oppToQuotes.put(quote.Opportunity__c, new List<Quote__c>());
                }
                oppToQuotes.get(quote.Opportunity__c).add(quote);
            }

            Map<Id, List<Quote_Line_Item__c>> quoteToLineItems = new Map<Id, List<Quote_Line_Item__c>>();
            List<Quote_Line_Item__c> quoteLineItems = [
                SELECT Id, Name, Description__c, Quantity__c, Unit_Price__c, Total_Price__c, Product__r.Name, Product__r.Family, Product__r.ProductCode, Quote__c
                FROM Quote_Line_Item__c
                WHERE Quote__c IN :quotes
            ];

            for (Quote_Line_Item__c lineItem : quoteLineItems) {
                if (!quoteToLineItems.containsKey(lineItem.Quote__c)) {
                    quoteToLineItems.put(lineItem.Quote__c, new List<Quote_Line_Item__c>());
                }
                quoteToLineItems.get(lineItem.Quote__c).add(lineItem);
            }

            for (Opportunity opp : opportunities) {
                OpportunityResponse oppResponse = new OpportunityResponse();
                oppResponse.Id = opp.Id;
                oppResponse.Name = opp.Name;
                oppResponse.StageName = opp.StageName;
                oppResponse.Probability = opp.Probability;
                oppResponse.CloseDate = opp.CloseDate;
                oppResponse.Amount = opp.Amount;
                oppResponse.Description = opp.Description;
                oppResponse.CreatedById = opp.CreatedById;
                oppResponse.LastModifiedById = opp.LastModifiedById;
                oppResponse.OwnerId = opp.OwnerId;
                oppResponse.Type = opp.Type;
                oppResponse.LeadSource = opp.LeadSource;
                oppResponse.ExpectedRevenue = opp.ExpectedRevenue;
                
                if (oppToQuotes.containsKey(opp.Id)) {
                    for (Quote__c quote : oppToQuotes.get(opp.Id)) {
                        QuoteResponse quoteResponse = new QuoteResponse();
                        quoteResponse.Id = quote.Id;
                        quoteResponse.Name = quote.Name;
                        quoteResponse.Status = quote.Status__c;
                        quoteResponse.QuoteNumber = quote.Quote_Number__c;
                        quoteResponse.GrandTotal = quote.Grand_Total__c;
                        quoteResponse.Description = quote.Description__c;
                        quoteResponse.Discount = quote.Discount__c;
                        quoteResponse.GST = quote.GST__c;
                        quoteResponse.ValidFrom = quote.Quote_Valid_From__c;
                        quoteResponse.ValidUntil = quote.Quote_Valid_Until__c;
                        
                        if (quoteToLineItems.containsKey(quote.Id)) {
                            for (Quote_Line_Item__c lineItem : quoteToLineItems.get(quote.Id)) {
                                QuoteLineItemResponse lineItemResponse = new QuoteLineItemResponse();
                                lineItemResponse.Id = lineItem.Id;
                                lineItemResponse.Name = lineItem.Name;
                                lineItemResponse.Description = lineItem.Description__c;
                                lineItemResponse.Quantity = lineItem.Quantity__c;
                                lineItemResponse.UnitPrice = lineItem.Unit_Price__c;
                                lineItemResponse.TotalPrice = lineItem.Total_Price__c;
                                lineItemResponse.ProductName = lineItem.Product__r.Name;
                                lineItemResponse.ProductFamily = lineItem.Product__r.Family;
                                lineItemResponse.ProductCode = lineItem.Product__r.ProductCode;
                                quoteResponse.LineItems.add(lineItemResponse);
                            }
                        }
                        oppResponse.Quotes.add(quoteResponse);
                    }
                }
                response.Opportunities.add(oppResponse);
            }
        } catch (Exception e) {
            response.error = e.getMessage();
        }

        return response;
    }
    
    @AuraEnabled(cacheable=true)
    public static String getAccountDataForAuraAndLWC(Id accountId) {
        AccountDataResponse res = getAccountData(accountId);
        return JSON.serialize(res);
    }

    @InvocableMethod(label='Get Account Data in JSON for Automation' description='Returns JSON string of account data for a given account ID.')
    public static List<String> getAccountDataForAutomation(List<Id> accountIds) {
        Id accountId = accountIds.size() > 0 ? accountIds.get(0) : null;
        AccountDataResponse res = getAccountData(accountId);
        List<String> result = new List<String>();
        result.add(JSON.serialize(res));
        return result;
    }

    public class AccountDataResponse {
        public List<OpportunityResponse> Opportunities = new List<OpportunityResponse>();
        public String error;
    }

    public class OpportunityResponse {
        public Id Id;
        public String Name;
        public String StageName;
        public Decimal Probability;
        public Date CloseDate;
        public Decimal Amount;
        public String Description;
        public Id CreatedById;
        public Id LastModifiedById;
        public Id OwnerId;
        public String Type;
        public String LeadSource;
        public Decimal ExpectedRevenue;
        public List<QuoteResponse> Quotes = new List<QuoteResponse>();
    }

    public class QuoteResponse {
        public Id Id;
        public String Name;
        public String Status;
        public String QuoteNumber;
        public Decimal GrandTotal;
        public String Description;
        public Decimal Discount;
        public Decimal GST;
        public Date ValidFrom;
        public Date ValidUntil;
        public List<QuoteLineItemResponse> LineItems = new List<QuoteLineItemResponse>();
    }

    public class QuoteLineItemResponse {
        public Id Id;
        public String Name;
        public String Description;
        public Decimal Quantity;
        public Decimal UnitPrice;
        public Decimal TotalPrice;
        public String ProductName;
        public String ProductFamily;
        public String ProductCode;
    }
}