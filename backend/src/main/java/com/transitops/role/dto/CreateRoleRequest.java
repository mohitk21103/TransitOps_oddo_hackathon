package com.transitops.role.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateRoleRequest(
        @NotBlank @Size(max = 40) String name,
        @Size(max = 200) String description
) {
}
