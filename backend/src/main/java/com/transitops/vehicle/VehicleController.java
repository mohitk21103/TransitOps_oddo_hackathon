package com.transitops.vehicle;

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

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService service;

    public VehicleController(VehicleService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<PageResponse<VehicleResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int pageSize) {
        return ApiResponse.ok(service.list(page, pageSize));
    }

    @GetMapping("/dispatchable")
    public ApiResponse<List<VehicleResponse>> dispatchable() {
        return ApiResponse.ok(service.listDispatchable());
    }

    @GetMapping("/{id}")
    public ApiResponse<VehicleResponse> get(@PathVariable UUID id) {
        return ApiResponse.ok(service.get(id));
    }

    @PostMapping
    public ApiResponse<VehicleResponse> create(@Valid @RequestBody VehicleRequest request) {
        return ApiResponse.ok(service.create(request), "Vehicle created");
    }

    @PatchMapping("/{id}")
    public ApiResponse<VehicleResponse> update(@PathVariable UUID id, @RequestBody VehicleRequest request) {
        return ApiResponse.ok(service.update(id, request), "Vehicle updated");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ApiResponse.ok(null, "Vehicle deleted");
    }
}
