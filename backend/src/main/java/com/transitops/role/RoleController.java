package com.transitops.role;

import com.transitops.role.CreateRoleRequest;
import com.transitops.common.ApiResponse;
import com.transitops.role.RoleResponse;
import com.transitops.role.RoleService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    /** Any authenticated user can read the role catalogue. */
    @GetMapping
    public ApiResponse<List<RoleResponse>> list() {
        return ApiResponse.ok(roleService.list());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<RoleResponse> create(@Valid @RequestBody CreateRoleRequest request) {
        return ApiResponse.ok(roleService.create(request), "Role created");
    }
}
