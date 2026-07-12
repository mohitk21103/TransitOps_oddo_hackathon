package com.transitops.security;

import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.stereotype.Service;

/**
 * Placeholder user store using demo accounts.
 *
 * TODO(schema): replace with a JPA-backed implementation once the Users/Roles
 * tables are defined. Only this class changes — the rest of the security stack
 * depends on the {@link UserDetailsService} abstraction.
 */
@Service
public class AppUserDetailsService {

    /**
     * Seeds a few demo accounts (password for all: {@code password}) covering the
     * RBAC roles. Swap for a DB lookup later.
     */
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder encoder) {
        String pw = encoder.encode("password");
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(user("admin@transitops.com", pw, Role.ADMIN));
        manager.createUser(user("dispatcher@transitops.com", pw, Role.DISPATCHER));
        manager.createUser(user("manager@transitops.com", pw, Role.MANAGER));
        manager.createUser(user("viewer@transitops.com", pw, Role.VIEWER));
        return manager;
    }

    private static UserDetails user(String email, String encodedPassword, Role role) {
        return User.withUsername(email)
                .password(encodedPassword)
                .authorities(role.authority())
                .build();
    }

    /** Convenience for callers that want a clear failure instead of null. */
    public static UsernameNotFoundException notFound(String email) {
        return new UsernameNotFoundException("No user for " + email);
    }
}
