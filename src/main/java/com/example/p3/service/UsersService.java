package com.example.p3.service;

import com.example.p3.model.Users;
import com.example.p3.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

// UserDetailsService - funktioner heri bruges til user Authotication

@Service
public class UsersService implements UserDetailsService {

    @Autowired
    private UsersRepository usersRepository;

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
}