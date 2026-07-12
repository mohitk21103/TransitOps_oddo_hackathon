package com.transitops.config;

import com.transitops.role.Role;
import com.transitops.user.User;
import com.transitops.role.RoleName;
import com.transitops.role.RoleRepository;
import com.transitops.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;

/**
 * Idempotent bootstrap: ensures the RBAC roles and a default admin account
 * exist. Safe to run on every startup and on any environment (Postgres where
 * Flyway already seeded roles, or H2 where it did not).
 */
@Component
@Order(1)
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private static final String ADMIN_EMAIL = "admin@transitops.com";
    private static final String ADMIN_PASSWORD = "password";

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        for (RoleName role : RoleName.values()) {
            if (!roleRepository.existsByName(role.name())) {
                roleRepository.save(new Role(role.name(), role.getDescription()));
                log.info("Seeded role {}", role.name());
            }
        }

        if (!userRepository.existsByEmail(ADMIN_EMAIL)) {
            Role adminRole = roleRepository.findByName(RoleName.ADMIN.name()).orElseThrow();
            User admin = new User(ADMIN_EMAIL, passwordEncoder.encode(ADMIN_PASSWORD), "TransitOps Admin");
            admin.setRoles(new HashSet<>(List.of(adminRole)));
            userRepository.save(admin);
            log.info("Seeded default admin user {} (password: {})", ADMIN_EMAIL, ADMIN_PASSWORD);
        }
    }
}
