package com.transitops.controller;

import com.transitops.dto.request.LoginRequest;
import com.transitops.dto.response.ApiResponse;
import com.transitops.dto.response.AuthResponse;
import com.transitops.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Map;

/**
 * Authentication endpoints. Login exchanges email+password for a JWT that the
 * SPA sends back as {@code Authorization: Bearer <token>} on every request.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        String token = jwtUtil.generateToken(request.email(), roles);
        return ApiResponse.ok(
                AuthResponse.bearer(token, request.email(), roles, jwtUtil.getExpirationMs()),
                "Login successful");
    }

    /** Returns the currently authenticated principal — handy for the SPA to hydrate. */
    @GetMapping("/me")
    public ApiResponse<Map<String, Object>> me(Principal principal) {
        return ApiResponse.ok(Map.of("email", principal.getName()));
    }
}
