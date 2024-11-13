package com.example.p3.security;

import com.example.p3.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.server.authentication.logout.*;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UsersService usersService;

    @Bean
    public UserDetailsService userDetailsService() {
        return usersService;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(usersService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }



    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(httpForm -> {
                    httpForm.loginPage("/login").permitAll();
                    httpForm.loginPage("/index").permitAll();
                    httpForm.defaultSuccessUrl("/boat", true);
                })

                .authorizeHttpRequests(registry -> {
                    registry.requestMatchers("/css/**", "/js/**", "/login","/index", "/approvedBoats").permitAll();

                    // Kun brugere med rollen VESSEL_USER kan tilgå denne side
                    registry.requestMatchers("/vesselInspectorBoatRequests").hasRole("VESSEL_USER");
                    registry.requestMatchers("/vesselInspectorBerthList").hasRole("VESSEL_USER");
                    registry.requestMatchers("/vesselInspectorStartPage").hasRole("VESSEL_USER");
                    // Kun brugere med rollen BOOKKEEPER_USER kan tilgå denne side
                    registry.requestMatchers("/bookkeeperBoatRequests").hasRole("BOOKKEEPER_USER");
                    registry.requestMatchers("/bookkeeperMemberList").hasRole("BOOKKEEPER_USER");
                    registry.requestMatchers("/bookkeeperMemberRequests").hasRole("BOOKKEEPER_USER");
                    registry.requestMatchers("/bookkeeperStartPage").hasRole("BOOKKEEPER_USER");

                    registry.anyRequest().authenticated();
                })

                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/index")
                        .permitAll()
                )

                .build();
    }

}
