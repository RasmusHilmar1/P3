package com.example.p3.controller;

import com.example.p3.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.security.Principal; // principal er den user som ER logget ind lige nu.

@Controller
public class PasswordController {

    @Autowired
    private UsersService usersService;

    // håndtere GET request som kommer til /update-password for at render password formen
    @GetMapping("/update-password")
    public String updatePasswordForm() {
        return "update-password";
    }

    // håndtere POST request som kommer til /update-password for at POST data securely
    @PostMapping("/update-password")
    public String updatePassword(@RequestParam String currentPassword,
                                 @RequestParam String newPassword,
                                 @RequestParam String confirmPassword,
                                 Principal principal, Model model) {
        try {
            if (!newPassword.equals(confirmPassword)) {
                model.addAttribute("error", "New passwords do not match");
                return "update-password";
            }

            usersService.updatePassword(principal.getName(), currentPassword, newPassword);
            model.addAttribute("message", "Password updated successfully");

        } catch (Exception e) {
            // håndterer hvis der kommer en exception
            model.addAttribute("error", e.getMessage());
        }
        return "update-password";
    }
}
