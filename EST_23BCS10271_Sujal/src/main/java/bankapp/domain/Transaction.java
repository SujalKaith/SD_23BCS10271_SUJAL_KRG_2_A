package bankapp.domain;

import java.time.LocalDateTime;


public class Transaction {
    private final String transactionId;
    private final String accountNumber;
    private final TransactionType type;
    private final decimal amount;
    private final LocalDateTime timestamp;
    private final String description;

    public Transaction(String accountNumber, TransactionType type, decimal amount, String description) {
        this.transactionId = java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        this.accountNumber = accountNumber;
        this.type = type;
        this.amount = amount;
        this.timestamp = LocalDateTime.now();
        this.description = description;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public TransactionType getType() {
        return type;
    }

    public decimal getAmount() {
        return amount;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getDescription() {
        return description;
    }

    @Override
    public String toString() {
        return String.format("[%s] %s: $%s - %s", 
            timestamp.toString().substring(11, 19), 
            type, 
            amount.toString(), 
            description != null ? description : "N/A");
    }
}

enum TransactionType {
    DEPOSIT,
    WITHDRAWAL,
    TRANSFER
}