package com.transitops.common;

import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

/**
 * Builds a case-insensitive "OR ILIKE" {@link Specification} across one or more
 * string attributes. Dotted paths are traversed as to-one joins
 * (e.g. {@code "vehicle.registrationNumber"}).
 *
 * Returns {@code null} when the term is blank or no paths are given, so callers
 * can pass the result straight to {@code repository.findAll(spec, pageable)} —
 * a null spec simply applies no restriction.
 */
public final class SearchSpecs {

    private SearchSpecs() {
    }

    public static <T> Specification<T> textSearch(String term, String... paths) {
        if (term == null || term.isBlank() || paths.length == 0) {
            return null;
        }
        String like = "%" + term.toLowerCase() + "%";
        return (root, query, cb) -> {
            Predicate[] matches = new Predicate[paths.length];
            for (int i = 0; i < paths.length; i++) {
                matches[i] = cb.like(cb.lower(resolve(root, paths[i])), like);
            }
            return cb.or(matches);
        };
    }

    @SuppressWarnings("unchecked")
    private static Path<String> resolve(Path<?> root, String dottedPath) {
        Path<?> path = root;
        for (String part : dottedPath.split("\\.")) {
            path = path.get(part);
        }
        return (Path<String>) path;
    }
}
