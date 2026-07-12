package com.transitops.user;

import com.transitops.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * User & role administration. Restricted to ADMIN via method security.
 */
@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ApiResponse<List<UserResponse>> list() {
        return ApiResponse.ok(userService.list());
    }

    @GetMapping("/{id}")
    public ApiResponse<UserResponse> get(@PathVariable UUID id) {
        return ApiResponse.ok(userService.get(id));
    }

    @PostMapping
    public ApiResponse<UserResponse> create(@Valid @RequestBody CreateUserRequest request) {
        return ApiResponse.ok(userService.create(request), "User created");
    }

    /** Replace a user's roles (a user may hold several). */
    @PatchMapping("/{id}/roles")
    public ApiResponse<UserResponse> setRoles(@PathVariable UUID id,
                                              @Valid @RequestBody AssignRolesRequest request) {
        return ApiResponse.ok(userService.setRoles(id, request.roles()), "Roles updated");
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<UserResponse> setActive(@PathVariable UUID id, @RequestParam boolean active) {
        return ApiResponse.ok(userService.setActive(id, active), active ? "User activated" : "User deactivated");
    }
}
