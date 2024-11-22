package com.example.p3.service;

import com.example.p3.model.Users;
import com.example.p3.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

// UserDetailsService - funktioner heri bruges til user Authotication

@Service
public class UsersService implements UserDetailsService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Users> user = usersRepository.findByUsername(username);
        if (user.isPresent()) {
            Users users = user.get();

            String role = switch (username) {
                case "vessel" -> "VESSEL_USER";
                case "bookkeeper" -> "BOOKKEEPER_USER";
                default -> throw new UsernameNotFoundException("User not found with username: " + username);
            };

            return User.builder()
                    .username(users.getUsername())
                    .password(users.getPassword())
                    .roles(role)
                    .build();
        } else {
            throw new UsernameNotFoundException(username);
        }
    }

    public void updatePassword(String username, String currentPassword, String newPassword) throws Exception{
        // finder users by username for at finde den rigteige user.
        Users user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // man tjekker om den currentPassword som er indtastet matcher det nuværende password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new Exception("Passwords do not match");
        }

        // encode, set og save det nye password
        user.setPassword(passwordEncoder.encode(newPassword));
        usersRepository.save(user);
    }
}