package com.transitops.auth;

import com.transitops.role.Role;
import com.transitops.user.User;
import com.transitops.common.ApiResponse;
import com.transitops.user.UserResponse;
import com.transitops.common.ResourceNotFoundException;
import com.transitops.user.UserRepository;
import com.transitops.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Authentication endpoints. Login verifies credentials, issues a JWT whose
 * payload carries uid / name / email / roles, and returns the user profile.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    @Transactional
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        String email = request.email().trim().toLowerCase();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password()));

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> ResourceNotFoundException.of("User", email));
        user.setLastLoginAt(Instant.now());

        List<String> roles = user.getRoles().stream().map(Role::getName).sorted().toList();

        // JWT payload — the claims the SPA reads.
        Map<String, Object> claims = new LinkedHashMap<>();
        claims.put("uid", user.getId().toString());
        claims.put("email", user.getEmail());
        claims.put("name", user.getFullName());
        claims.put("roles", roles);

        String token = jwtUtil.generateToken(user.getEmail(), claims);

        return ApiResponse.ok(
                AuthResponse.bearer(token, user.getEmail(), roles, jwtUtil.getExpirationMs()),
                "Login successful");
    }

    /** Current authenticated user's profile (roles included). */
    @GetMapping("/me")
    @Transactional(readOnly = true)
    public ApiResponse<UserResponse> me(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> ResourceNotFoundException.of("User", email));
        return ApiResponse.ok(UserResponse.from(user));
    }
}
