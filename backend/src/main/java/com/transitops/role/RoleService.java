package com.transitops.role;

import com.transitops.common.ResourceNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Transactional(readOnly = true)
    public List<RoleResponse> list() {
        return roleRepository.findAll().stream()
                .sorted(Comparator.comparing(Role::getName))
                .map(RoleResponse::from)
                .toList();
    }

    @Transactional
    public RoleResponse create(CreateRoleRequest request) {
        String name = request.name().trim().toUpperCase();
        if (roleRepository.existsByName(name)) {
            throw new DataIntegrityViolationException("Role already exists: " + name);
        }
        return RoleResponse.from(roleRepository.save(new Role(name, request.description())));
    }

    /** Resolve role names to managed entities, failing if any is unknown. */
    @Transactional(readOnly = true)
    public Set<Role> resolve(List<String> names) {
        return names.stream()
                .map(n -> roleRepository.findByName(n.trim().toUpperCase())
                        .orElseThrow(() -> ResourceNotFoundException.of("Role", n)))
                .collect(Collectors.toSet());
    }
}
