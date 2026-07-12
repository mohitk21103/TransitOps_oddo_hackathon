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
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

/**
 * Idempotent bootstrap: ensures the four RBAC roles and one demo user per role
 * exist. Safe to run on every startup and on any environment.
 */
@Component
@Order(1)
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private static final String DEMO_PASSWORD = "demo1234";

    /** email, full name, role — one demo account per persona. */
    private record DemoUser(String email, String name, RoleName role) {
    }

    private static final List<DemoUser> DEMO_USERS = List.of(
            new DemoUser("fleet@transitops.in", "Fleet Manager", RoleName.FLEET_MANAGER),
            new DemoUser("dispatch@transitops.in", "Dispatcher", RoleName.DISPATCHER),
            new DemoUser("safety@transitops.in", "Safety Officer", RoleName.SAFETY_OFFICER),
            new DemoUser("finance@transitops.in", "Financial Analyst", RoleName.FINANCIAL_ANALYST));

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
    @Transactional
    public void run(String... args) {
        // Seed only when the tables are empty — a single count() each, instead of
        // one existence query per role/user on every startup.
        if (roleRepository.count() == 0) {
            for (RoleName role : RoleName.values()) {
                roleRepository.save(new Role(role.name(), role.getDescription()));
            }
            log.info("Seeded {} RBAC roles", RoleName.values().length);
        }

        if (userRepository.count() == 0) {
            for (DemoUser demo : DEMO_USERS) {
                Role role = roleRepository.findByName(demo.role().name()).orElseThrow();
                User user = new User(demo.email(), passwordEncoder.encode(DEMO_PASSWORD), demo.name());
                user.setRoles(new HashSet<>(List.of(role)));
                userRepository.save(user);
            }
            log.info("Seeded {} demo users", DEMO_USERS.size());
        }
    }
}
