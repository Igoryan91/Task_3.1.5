package ru.kata.spring.boot_security.demo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.UserRepository;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Autowired
    public UserServiceImpl(UserRepository userRepository, @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user==null)
            throw new UsernameNotFoundException(String.format("Пользователь '%s' не найден", username));
        return new org.springframework.security.core.userdetails.User(user.getUsername(),
                user.getPassword(), user.getRoles());
    }

    @Transactional
    @Override
    public void saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Override
    public User getUser(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    @Override
    public void updateUser(String usernameUpdatingUser, User updatedUser){
        System.out.println(updatedUser.getPassword() == null);
        if (updatedUser.getPassword().equals("")) {
            updatedUser
                    .setPassword(userRepository.findByUsername(usernameUpdatingUser).getPassword());
        } else {
            updatedUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }
        updatedUser.setId(userRepository.findByUsername(usernameUpdatingUser).getId());
        userRepository.save(updatedUser);
    }

    @Transactional
    @Override
    public void removeUser(int id) {
        userRepository.deleteById(id);
    }
}
