package com.transitops.common;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Map;

/**
 * Normalised query parameters for a list endpoint: free-text {@code search},
 * {@code sortBy}/{@code sortDir}, and {@code page}/{@code pageSize}.
 *
 * Sorting is whitelisted per entity (see {@link #toPageable}) so an unknown or
 * malicious {@code sortBy} can never reach the query — it silently falls back
 * to the entity's default sort instead of throwing a PropertyReferenceException.
 * The whitelist maps the PUBLIC field name the client sends (i.e. the response
 * DTO field, such as {@code "name"} or {@code "date"}) to the underlying JPA
 * property to sort on (such as {@code "fullName"} or {@code "loggedAt"}).
 */
public record ListQuery(String search, String sortBy, String sortDir, int page, int pageSize) {

    private static final int DEFAULT_PAGE_SIZE = 50;
    private static final int MAX_PAGE_SIZE = 200;

    /** The trimmed search term, or {@code null} when absent/blank so specs can no-op. */
    public String searchTerm() {
        if (search == null) {
            return null;
        }
        String trimmed = search.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    /**
     * Build a safe {@link Pageable}. {@code sortBy} is honoured only when it is
     * a key of {@code sortableFields} (public name → JPA property); otherwise
     * {@code defaultProperty} is used. Direction is DESC unless {@code sortDir}
     * is "asc" (case-insensitive). Page/size are clamped to sane bounds.
     */
    public Pageable toPageable(Map<String, String> sortableFields, String defaultProperty) {
        String property = (sortBy != null && sortableFields.containsKey(sortBy))
                ? sortableFields.get(sortBy)
                : defaultProperty;
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        int safePage = Math.max(page, 0);
        int safeSize = pageSize <= 0 ? DEFAULT_PAGE_SIZE : Math.min(pageSize, MAX_PAGE_SIZE);
        return PageRequest.of(safePage, safeSize, Sort.by(direction, property));
    }
}
