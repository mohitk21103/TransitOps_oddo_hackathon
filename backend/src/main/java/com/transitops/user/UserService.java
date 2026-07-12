package com.transitops.user;
import com.transitops.user.dto.*;
import com.transitops.role.RoleService;

import com.transitops.common.ResourceNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleService roleService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> list() {
        return userRepository.findAll().stream().map(UserResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public UserResponse get(UUID id) {
        return UserResponse.from(find(id));
    }

    @Transactional
    public UserResponse create(CreateUserRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new DataIntegrityViolationException("Email already registered: " + email);
        }
        User user = new User(email, passwordEncoder.encode(request.password()), request.fullName().trim());
        user.setRoles(roleService.resolve(request.roles()));
        return UserResponse.from(userRepository.save(user));
    }

    /** Replace a user's roles (a user may hold several). */
    @Transactional
    public UserResponse setRoles(UUID id, List<String> roleNames) {
        User user = find(id);
        user.setRoles(roleService.resolve(roleNames));
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public UserResponse setActive(UUID id, boolean active) {
        User user = find(id);
        user.setActive(active);
        return UserResponse.from(userRepository.save(user));
    }

    private User find(UUID id) {
        return userRepository.findById(id).orElseThrow(() -> ResourceNotFoundException.of("User", id));
    }
}
