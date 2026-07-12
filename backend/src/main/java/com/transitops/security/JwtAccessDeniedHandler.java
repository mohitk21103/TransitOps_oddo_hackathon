package com.transitops.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;

/**
 * Returns a 403 in the shared ApiResponse envelope when an *authenticated* user
 * lacks the required role. Distinct from the 401 entry point so the SPA does NOT
 * treat a permission error as a session-expiry and log the user out.
 */
@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        String body = """
                {"success":false,"data":null,"message":"You do not have permission to perform this action","details":null,"timestamp":"%s"}"""
                .formatted(Instant.now());
        response.getWriter().write(body);
    }
}
