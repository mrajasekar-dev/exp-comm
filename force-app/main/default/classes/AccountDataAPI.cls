@RestResource(urlMapping='/accountData/*')
global with sharing class AccountDataAPI {
    @HttpGet
    global static String getAccountData() {
        RestRequest req = RestContext.request;
        String accountId = req.requestURI.substring(req.requestURI.lastIndexOf('/')+1);
        
        AccountDataHelper.AccountDataResponse response = AccountDataHelper.getAccountData(accountId);
        return JSON.serialize(response);
    }
}