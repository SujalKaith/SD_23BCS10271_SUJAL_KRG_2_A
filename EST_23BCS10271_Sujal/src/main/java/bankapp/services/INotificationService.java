package bankapp.services;


public interface INotificationService {
    void sendDepositNotification(String accountNumber, decimal amount);
    void sendWithdrawalNotification(String accountNumber, decimal amount);
    void sendTransferNotification(String fromAccount, String toAccount, decimal amount);
}