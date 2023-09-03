package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;
import ru.kata.spring.boot_security.demo.util.UserValidator;

import javax.validation.Valid;
import java.security.Principal;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final UserValidator userValidator;
    private final RoleService roleService;
    private static final String REDIRECT = "redirect:";

    @Autowired
    public AdminController(UserService userService, UserValidator userValidator, RoleService roleService) {
        this.userService = userService;
        this.userValidator = userValidator;
        this.roleService = roleService;
    }

    @GetMapping()
    public String adminPage(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userSecurity = (UserDetails) authentication.getPrincipal();
        model.addAttribute("user", userService.getUser(userSecurity.getUsername()));
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("roles", roleService.addAllRoles());
        return "admin/adminPage";
    }

    @GetMapping("/new")
    public String createPage(@ModelAttribute("user") User user, Principal principal,
                             Model model) {
        model.addAttribute("authUser", userService.getUser(principal.getName()));
        model.addAttribute("roles", roleService.addAllRoles());
        return "admin/new";
    }

    @PostMapping("/save")
    public String saveNewUser(@ModelAttribute("user") @Valid User user, Principal principal,
                              Model model, BindingResult bindingResult,
                              @RequestParam(required = false) String role) {
        model.addAttribute("authUser", userService.getUser(principal.getName()));
        model.addAttribute("roles", roleService.addAllRoles());
        userValidator.validate(user, bindingResult);
        if (bindingResult.hasErrors())
            return "admin/new";
        userService.saveUser(user, role);
        return REDIRECT;
    }

    @PatchMapping("/{username}")
    public String saveUpdatedUser(@ModelAttribute("user") @Valid User user, BindingResult bindingResult,
                                  @PathVariable("username") String username, Model model,
                                  @RequestParam(required = false) String role) {
        System.out.println(username);
        if (!user.getUsername().equals(username)) {
            userValidator.validate(user, bindingResult);
        }
        if (bindingResult.hasErrors()) {
            model.addAttribute("user", userService.getUser(username));
            return REDIRECT;
        }
        userService.updateUser(user, username, role);
        return REDIRECT;
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable("id") int id) {
        userService.removeUser(id);
        return REDIRECT;
    }
}
