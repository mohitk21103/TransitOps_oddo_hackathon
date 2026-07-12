package com.transitops.user;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record AssignRolesRequest(
        @NotEmpty List<String> roles
) {
}
