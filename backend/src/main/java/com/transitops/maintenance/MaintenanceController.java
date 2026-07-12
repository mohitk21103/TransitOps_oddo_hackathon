package com.transitops.maintenance;

import com.transitops.common.ApiResponse;
import com.transitops.common.PageResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final MaintenanceService service;

    public MaintenanceController(MaintenanceService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<PageResponse<MaintenanceResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int pageSize) {
        return ApiResponse.ok(service.list(page, pageSize));
    }

    @GetMapping("/{id}")
    public ApiResponse<MaintenanceResponse> get(@PathVariable UUID id) {
        return ApiResponse.ok(service.get(id));
    }

    @PostMapping
    public ApiResponse<MaintenanceResponse> create(@Valid @RequestBody MaintenanceRequest request) {
        return ApiResponse.ok(service.create(request), "Maintenance record created");
    }

    @PatchMapping("/{id}")
    public ApiResponse<MaintenanceResponse> update(@PathVariable UUID id, @RequestBody MaintenanceRequest request) {
        return ApiResponse.ok(service.update(id, request), "Maintenance record updated");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ApiResponse.ok(null, "Maintenance record deleted");
    }

    @PostMapping("/{id}/close")
    public ApiResponse<MaintenanceResponse> close(@PathVariable UUID id) {
        return ApiResponse.ok(service.close(id), "Maintenance closed");
    }
}
