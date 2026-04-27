package bankapp.data;

import bankapp.domain.Account;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


public class InMemoryAccountRepository implements IAccountRepository {
    private final Map<String, Account> accounts = new HashMap<>();

    @Override
    public Account getByAccountNumber(String accountNumber) {
        return accounts.get(accountNumber);
    }

    @Override
    public void save(Account account) {
        accounts.put(account.getAccountNumber(), account);
    }

    @Override
    public List<Account> getAll() {
        return accounts.values().stream().collect(Collectors.toList());
    }

    @Override
    public void delete(String accountNumber) {
        accounts.remove(accountNumber);
    }
}