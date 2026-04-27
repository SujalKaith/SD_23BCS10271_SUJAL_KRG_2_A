package bankapp.services;


public class ConsoleNotificationService implements INotificationService {

    @Override
    public void sendDepositNotification(String accountNumber, decimal amount) {
        System.out.println("[NOTIFICATION] Deposited $" + amount + " to account " + accountNumber);
    }

    @Override
    public void sendWithdrawalNotification(String accountNumber, decimal amount) {
        System.out.println("[NOTIFICATION] Withdrew $" + amount + " from account " + accountNumber);
    }

    @Override
    public void sendTransferNotification(String fromAccount, String toAccount, decimal amount) {
        System.out.println("[NOTIFICATION] Transferred $" + amount + " from " + fromAccount + " to " + toAccount);
    }
}