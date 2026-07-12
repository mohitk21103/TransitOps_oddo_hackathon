package com.transitops.fuel;

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
@RequestMapping("/api/fuel-logs")
public class FuelController {

    private final FuelService service;

    public FuelController(FuelService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<PageResponse<FuelResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int pageSize) {
        return ApiResponse.ok(service.list(page, pageSize));
    }

    @GetMapping("/{id}")
    public ApiResponse<FuelResponse> get(@PathVariable UUID id) {
        return ApiResponse.ok(service.get(id));
    }

    @PostMapping
    public ApiResponse<FuelResponse> create(@Valid @RequestBody FuelRequest request) {
        return ApiResponse.ok(service.create(request), "Fuel log recorded");
    }

    @PatchMapping("/{id}")
    public ApiResponse<FuelResponse> update(@PathVariable UUID id, @RequestBody FuelRequest request) {
        return ApiResponse.ok(service.update(id, request), "Fuel log updated");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ApiResponse.ok(null, "Fuel log deleted");
    }
}
