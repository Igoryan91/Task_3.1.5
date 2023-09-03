package ru.kata.spring.boot_security.demo.repository;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

@Repository
public interface UserRepository {
    List<User> findAll();
    void save(User user);
    void update(User user);
    void deleteById(int id);
    User getById(int id);
    User findByUsername(String userName);
}
