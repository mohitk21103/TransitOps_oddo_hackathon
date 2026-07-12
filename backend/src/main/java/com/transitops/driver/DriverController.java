package com.transitops.driver;

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
@RequestMapping("/api/drivers")
public class DriverController {

    private final DriverService service;

    public DriverController(DriverService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<PageResponse<DriverResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int pageSize) {
        return ApiResponse.ok(service.list(page, pageSize));
    }

    @GetMapping("/assignable")
    public ApiResponse<List<DriverResponse>> assignable() {
        return ApiResponse.ok(service.listAssignable());
    }

    @GetMapping("/{id}")
    public ApiResponse<DriverResponse> get(@PathVariable UUID id) {
        return ApiResponse.ok(service.get(id));
    }

    @PostMapping
    public ApiResponse<DriverResponse> create(@Valid @RequestBody DriverRequest request) {
        return ApiResponse.ok(service.create(request), "Driver created");
    }

    @PatchMapping("/{id}")
    public ApiResponse<DriverResponse> update(@PathVariable UUID id, @RequestBody DriverRequest request) {
        return ApiResponse.ok(service.update(id, request), "Driver updated");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ApiResponse.ok(null, "Driver deleted");
    }
}
