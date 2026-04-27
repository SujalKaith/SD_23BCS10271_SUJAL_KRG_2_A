package bankapp.services;

import bankapp.data.IAccountRepository;
import bankapp.domain.Account;
import bankapp.domain.Transaction;
import bankapp.domain.TransactionType;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;


public class BankService {
    private final IAccountRepository repository;
    private final INotificationService notifications;
    private final List<Transaction> transactions = new ArrayList<>();

    public BankService(IAccountRepository repository, INotificationService notifications) {
        this.repository = repository;
        this.notifications = notifications;
    }

    public Account createAccount(String holderName, decimal initialBalance) {
        String accountNumber = generateAccountNumber();
        Account account = new Account(accountNumber, holderName, initialBalance);
        repository.save(account);
        System.out.println("Created account " + accountNumber + " for " + holderName);
        return account;
    }

    public void deposit(String accountNumber, decimal amount, String description) {
        Account account = repository.getByAccountNumber(accountNumber);
        if (account == null) {
            throw new IllegalStateException("Account not found");
        }

        account.deposit(amount);
        repository.save(account);
        transactions.add(new Transaction(accountNumber, TransactionType.DEPOSIT, amount, description));
        notifications.sendDepositNotification(accountNumber, amount);
    }

    public boolean withdraw(String accountNumber, decimal amount, String description) {
        Account account = repository.getByAccountNumber(accountNumber);
        if (account == null) {
            throw new IllegalStateException("Account not found");
        }

        if (!account.withdraw(amount)) {
            return false;
        }

        repository.save(account);
        transactions.add(new Transaction(accountNumber, TransactionType.WITHDRAWAL, amount, description));
        notifications.sendWithdrawalNotification(accountNumber, amount);
        return true;
    }

    public void transfer(String fromAccount, String toAccount, decimal amount) {
        Account from = repository.getByAccountNumber(fromAccount);
        Account to = repository.getByAccountNumber(toAccount);

        if (from == null || to == null) {
            throw new IllegalStateException("One or both accounts not found");
        }

        if (!from.withdraw(amount)) {
            throw new IllegalStateException("Insufficient funds");
        }

        to.deposit(amount);
        repository.save(from);
        repository.save(to);
        transactions.add(new Transaction(fromAccount, TransactionType.TRANSFER, amount, "To " + toAccount));
        notifications.sendTransferNotification(fromAccount, toAccount, amount);
    }

    public void printStatement(String accountNumber) {
        Account account = repository.getByAccountNumber(accountNumber);
        if (account == null) {
            throw new IllegalStateException("Account not found");
        }

        System.out.println("\n=== Statement for " + accountNumber + " ===");
        System.out.println("Holder: " + account.getHolderName());
        System.out.println("Balance: $" + account.getBalance());
        System.out.println("-----------------------------------");
        
        for (Transaction tx : transactions) {
            if (tx.getAccountNumber().equals(accountNumber)) {
                System.out.println(tx);
            }
        }
        
        System.out.println("===================================\n");
    }

    private String generateAccountNumber() {
        return "ACC" + new Random().nextInt(900000) + 100000;
    }
}