package com.transitops.security;

import com.transitops.config.SecurityProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Central helper for creating and verifying JWT access tokens.
 * The signing secret and lifetime are sourced from {@link SecurityProperties}
 * (i.e. env-overridable config), never hard-coded at call sites.
 */
@Component
public class JwtUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);
    private static final String ROLES_CLAIM = "roles";

    private final SecretKey signingKey;
    private final long expirationMs;
    private final String issuer;

    public JwtUtil(SecurityProperties props) {
        SecurityProperties.Jwt jwt = props.getJwt();
        this.signingKey = Keys.hmacShaKeyFor(jwt.getSecret().getBytes(StandardCharsets.UTF_8));
        this.expirationMs = jwt.getExpirationMs();
        this.issuer = jwt.getIssuer();
    }

    /**
     * Issue a signed token. {@code subject} is the login email; {@code claims}
     * carries the rest of the payload (uid, name, email, roles, ...).
     */
    public String generateToken(String subject, Map<String, Object> claims) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .subject(subject)
                .issuer(issuer)
                .claims(claims)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey)
                .compact();
    }

    public String getSubject(String token) {
        return parse(token).getSubject();
    }

    @SuppressWarnings("unchecked")
    public List<String> getRoles(String token) {
        Object roles = parse(token).get(ROLES_CLAIM);
        return roles instanceof List<?> list ? (List<String>) list : List.of();
    }

    /** @return true when the token is well-formed, correctly signed and unexpired. */
    public boolean isValid(String token) {
        try {
            parse(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            log.debug("Rejected JWT: {}", ex.getMessage());
            return false;
        }
    }

    public long getExpirationMs() {
        return expirationMs;
    }

    private Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .requireIssuer(issuer)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
