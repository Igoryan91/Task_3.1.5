package ru.kata.spring.boot_security.demo.service;


import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService extends UserDetailsService {
    void saveUser(User user, String role);

    User getUser(String username);

    List<User> getAllUsers();

    void updateUser(User user, String username, String role);

    void removeUser(int id);
}
