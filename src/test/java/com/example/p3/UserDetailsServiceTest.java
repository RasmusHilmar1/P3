package com.example.p3;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.example.p3.repository.UsersRepository;
import com.example.p3.service.UsersService;
import com.example.p3.model.Users;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class UserDetailsServiceTest {

    @Mock
    private UsersRepository usersRepository;

    @Mock
    private PasswordEncoder passwordEncoder; // Mock PasswordEncoder

    @InjectMocks
    private UsersService userDetailsService;  // Service class under test

        @Test
        public void testLoadUserByUsername() {
            // Arrange
            String username = "vessel";
            Users mockUser = new Users();
            mockUser.setUsername("vessel");
            mockUser.setPassword("password123");
            when(usersRepository.findByUsername(username)).thenReturn(Optional.of(mockUser));
            // Act
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            // Assert
            assertNotNull(userDetails);
            assertEquals("vessel", userDetails.getUsername());
            assertEquals("password123", userDetails.getPassword());
            assertTrue(userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_VESSEL_USER")));
        }

    @Test
    public void testLoadUserByUsername_NotFound() {
        // Arrange
        String username = "nonexistent";
        when(usersRepository.findByUsername(username)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () -> userDetailsService.loadUserByUsername(username));
    }

    @Test
    public void testUpdatePassword() throws Exception {
        // Arrange
        String username = "vessel";
        String currentPassword = "password123";
        String newPassword = "ThisIsNewPassword";

        Users user = new Users();
        user.setUsername(username);
        user.setPassword(currentPassword);

        when(usersRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(currentPassword, user.getPassword())).thenReturn(true);  // Mock password match
        when(passwordEncoder.encode(newPassword)).thenReturn("encodedNewPassword");  // Mock password encoding

        // Act
        userDetailsService.updatePassword(username, currentPassword, newPassword);

        // Assert
        Users updatedUser = usersRepository.findByUsername(username).orElseThrow();
        assertEquals("encodedNewPassword", updatedUser.getPassword());
        verify(usersRepository).save(updatedUser);  // Verify that the repository save method was called
    }
}
