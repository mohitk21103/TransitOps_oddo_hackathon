package com.transitops.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateUserRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6, max = 72) String password,
        @NotBlank String fullName,
        @NotEmpty List<String> roles
) {
}
