package com.transitops.auth;
import com.transitops.auth.dto.*;

import com.transitops.common.ApiResponse;
import com.transitops.common.ResourceNotFoundException;
import com.transitops.role.Role;
import com.transitops.security.JwtUtil;
import com.transitops.user.User;
import com.transitops.user.UserRepository;
import com.transitops.user.dto.UserResponse;
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
 * Authentication endpoints. Login verifies credentials, issues a JWT, and
 * returns the SPA-shaped session { token, user: { id, name, email, role } }.
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

        Map<String, Object> claims = new LinkedHashMap<>();
        claims.put("uid", user.getId().toString());
        claims.put("email", user.getEmail());
        claims.put("name", user.getFullName());
        claims.put("roles", roles);

        String token = jwtUtil.generateToken(user.getEmail(), claims);
        return ApiResponse.ok(new AuthResponse(token, AuthUser.from(user)), "Login successful");
    }

    /** Current authenticated user's profile ({ id, email, fullName, active, roles[] }). */
    @GetMapping("/me")
    @Transactional(readOnly = true)
    public ApiResponse<UserResponse> me(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> ResourceNotFoundException.of("User", authentication.getName()));
        return ApiResponse.ok(UserResponse.from(user));
    }

    /** Stateless logout — the client just drops its token. Provided for symmetry. */
    @PostMapping("/logout")
    public ApiResponse<Void> logout() {
        return ApiResponse.ok(null, "Logged out");
    }
}
