package com.transitops.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

/**
 * Strongly-typed binding for {@code transitops.security.*} in application.yml.
 * Keeps all security tunables (JWT + CORS) in one place and env-overridable.
 */
@ConfigurationProperties(prefix = "transitops.security")
public class SecurityProperties {

    private final Jwt jwt;
    private final Cors cors;

    public SecurityProperties(Jwt jwt, Cors cors) {
        this.jwt = jwt;
        this.cors = cors;
    }

    public Jwt getJwt() {
        return jwt;
    }

    public Cors getCors() {
        return cors;
    }

    /** JWT signing/verification settings. */
    public static class Jwt {
        private final String secret;
        private final long expirationMs;
        private final String issuer;

        public Jwt(String secret, long expirationMs, String issuer) {
            this.secret = secret;
            this.expirationMs = expirationMs;
            this.issuer = issuer;
        }

        public String getSecret() {
            return secret;
        }

        public long getExpirationMs() {
            return expirationMs;
        }

        public String getIssuer() {
            return issuer;
        }
    }

    /** Cross-origin settings for the SPA frontend. */
    public static class Cors {
        private final List<String> allowedOrigins;

        public Cors(List<String> allowedOrigins) {
            this.allowedOrigins = allowedOrigins;
        }

        public List<String> getAllowedOrigins() {
            return allowedOrigins;
        }
    }
}
