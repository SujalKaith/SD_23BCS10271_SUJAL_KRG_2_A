package bankapp;

import bankapp.data.InMemoryAccountRepository;
import bankapp.domain.Account;
import bankapp.services.BankService;
import bankapp.services.ConsoleNotificationService;


public class Main {
    public static void main(String[] args) {
       
        var repository = new InMemoryAccountRepository();
        var notifications = new ConsoleNotificationService();
        var bank = new BankService(repository, notifications);

        System.out.println("=== SRP Bank Application Demo ===\n");

     
        Account alice = bank.createAccount("Alice Smith", new decimal("1000"));
        Account bob = bank.createAccount("Bob Jones", new decimal("500"));

      
        bank.deposit(alice.getAccountNumber(), new decimal("250"), "Salary");
        bank.withdraw(bob.getAccountNumber(), new decimal("100"), "ATM");
        bank.transfer(alice.getAccountNumber(), bob.getAccountNumber(), new decimal("200"), "Loan repayment");

       
        bank.printStatement(alice.getAccountNumber());
        bank.printStatement(bob.getAccountNumber());

        System.out.println("Each class follows Single Responsibility Principle:");
        System.out.println("- Account: holds account data");
        System.out.println("- Transaction: holds transaction data");
        System.out.println("- InMemoryAccountRepository: persists accounts");
        System.out.println("- ConsoleNotificationService: sends notifications");
        System.out.println("- BankService: orchestrates banking operations");
    }
}