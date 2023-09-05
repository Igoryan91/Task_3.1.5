package ru.kata.spring.boot_security.demo.service;


import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService extends UserDetailsService {
    void saveUser(User user, String role);

    User getUser(String username);

    Optional<User> findByUsername(String username);

    User getUserById(int id);

    List<User> getAllUsers();

    void updateUser(User user, int id, String role);

    void removeUser(int id);
}
