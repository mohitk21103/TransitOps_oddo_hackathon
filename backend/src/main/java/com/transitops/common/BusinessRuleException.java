package com.transitops.common;

import java.util.List;

/**
 * Thrown when a mandatory business rule is violated (e.g. cargo exceeds capacity,
 * driver licence expired). Mapped to HTTP 400 with the list of violations.
 */
public class BusinessRuleException extends RuntimeException {

    private final List<String> errors;

    public BusinessRuleException(List<String> errors) {
        super(String.join("; ", errors));
        this.errors = errors;
    }

    public BusinessRuleException(String error) {
        this(List.of(error));
    }

    public List<String> getErrors() {
        return errors;
    }
}
