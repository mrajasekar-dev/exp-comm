public with sharing class AccountDataController {
    @AuraEnabled
    public static String getAccountDataForReactApp(Id accountId) {
        AccountDataHelper.AccountDataResponse response = AccountDataHelper.getAccountData(accountId);
        return JSON.serialize(response);
    }
}