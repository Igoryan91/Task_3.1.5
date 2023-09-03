package ru.kata.spring.boot_security.demo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.service.RoleService;

import java.util.HashSet;
import java.util.Set;

@Transactional(readOnly = true)
@Service
public class RoleServiceImpl implements RoleService {
    private final RoleRepository repository;

    @Autowired
    public RoleServiceImpl(RoleRepository repository) {
        this.repository = repository;
    }

    @Override
    public Set<Role> addAllRoles() {
        return new HashSet<>(repository.findAll());
    }

    @Override
    public Role getById(int id) {
        return repository.findById(id);
    }

    @Override
    public Set<Role> rolesSetIds(String rolesId) {
        Set<Role> roles = new HashSet<>();
        for (String string : rolesId.split(",")) {
            roles.add(getById(Integer.parseInt(string)));
        }
        return roles;
    }
}
