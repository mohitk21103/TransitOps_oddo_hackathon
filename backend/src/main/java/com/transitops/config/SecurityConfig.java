package com.transitops.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.transitops.security.JwtAccessDeniedHandler;
import com.transitops.security.JwtAuthenticationEntryPoint;
import com.transitops.security.JwtAuthenticationFilter;

/**
 * Stateless JWT security. Public: auth endpoints + actuator health. Everything
 * else requires a valid Bearer token. {@code @EnableMethodSecurity} lets you add
 * {@code @PreAuthorize("hasRole('ADMIN')")} for fine-grained RBAC per handler.
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private static final String[] PUBLIC_PATHS = {
            "/api/auth/**",
            "/actuator/health",
            "/actuator/info",
            "/h2-console/**"
    };

    private final SecurityProperties securityProperties;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint authenticationEntryPoint;
    private final JwtAccessDeniedHandler accessDeniedHandler;

    public SecurityConfig(SecurityProperties securityProperties,
                          JwtAuthenticationFilter jwtAuthenticationFilter,
                          JwtAuthenticationEntryPoint authenticationEntryPoint,
                          JwtAccessDeniedHandler accessDeniedHandler) {
        this.securityProperties = securityProperties;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.accessDeniedHandler = accessDeniedHandler;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex.authenticationEntryPoint(authenticationEntryPoint).accessDeniedHandler(accessDeniedHandler))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(PUBLIC_PATHS).permitAll() // All Permit for Test

                        .requestMatchers(HttpMethod.POST, "/api/vehicles/**", "/api/maintenance/**").hasRole("FLEET_MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/vehicles/**", "/api/maintenance/**").hasRole("FLEET_MANAGER")
                        .requestMatchers(HttpMethod.PATCH, "/api/vehicles/**", "/api/maintenance/**").hasRole("FLEET_MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/api/vehicles/**", "/api/maintenance/**").hasRole("FLEET_MANAGER")

                        .requestMatchers(HttpMethod.POST, "/api/drivers/**").hasAnyRole("SAFETY_OFFICER", "FLEET_MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/drivers/**").hasAnyRole("SAFETY_OFFICER", "FLEET_MANAGER")
                        .requestMatchers(HttpMethod.PATCH, "/api/drivers/**").hasAnyRole("SAFETY_OFFICER", "FLEET_MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/api/drivers/**").hasAnyRole("SAFETY_OFFICER", "FLEET_MANAGER")

                        .requestMatchers(HttpMethod.POST, "/api/trips/**").hasAnyRole("DISPATCHER", "FLEET_MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/trips/**").hasAnyRole("DISPATCHER", "FLEET_MANAGER")
                        .requestMatchers(HttpMethod.PATCH, "/api/trips/**").hasAnyRole("DISPATCHER", "FLEET_MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/api/trips/**").hasAnyRole("DISPATCHER", "FLEET_MANAGER")

                        .requestMatchers(HttpMethod.POST, "/api/fuel-logs/**", "/api/expenses/**").hasAnyRole("FINANCIAL_ANALYST", "FLEET_MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/fuel-logs/**", "/api/expenses/**").hasAnyRole("FINANCIAL_ANALYST", "FLEET_MANAGER")
                        .requestMatchers(HttpMethod.PATCH, "/api/fuel-logs/**", "/api/expenses/**").hasAnyRole("FINANCIAL_ANALYST", "FLEET_MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/api/fuel-logs/**", "/api/expenses/**").hasAnyRole("FINANCIAL_ANALYST", "FLEET_MANAGER")

                        .requestMatchers("/api/users/**").hasRole("FLEET_MANAGER")
                        .requestMatchers(HttpMethod.POST, "/api/roles/**").hasRole("FLEET_MANAGER")

                        .requestMatchers(HttpMethod.GET, "/api/**").authenticated()
                        .anyRequest().authenticated())
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(securityProperties.getCors().getAllowedOrigins());
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
