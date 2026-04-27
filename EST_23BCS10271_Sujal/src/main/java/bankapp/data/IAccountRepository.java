package bankapp.data;

import bankapp.domain.Account;
import java.util.List;


public interface IAccountRepository {
    Account getByAccountNumber(String accountNumber);
    void save(Account account);
    List<Account> getAll();
    void delete(String accountNumber);
}