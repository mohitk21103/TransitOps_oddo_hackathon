package com.transitops.trip;
import com.transitops.trip.dto.*;

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
@RequestMapping("/api/trips")
public class TripController {

    private final TripService service;

    public TripController(TripService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<PageResponse<TripResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int pageSize) {
        return ApiResponse.ok(service.list(page, pageSize));
    }

    @GetMapping("/{id}")
    public ApiResponse<TripResponse> get(@PathVariable UUID id) {
        return ApiResponse.ok(service.get(id));
    }

    @PostMapping
    public ApiResponse<TripResponse> create(@Valid @RequestBody TripRequest request) {
        return ApiResponse.ok(service.create(request), "Trip created");
    }

    @PatchMapping("/{id}")
    public ApiResponse<TripResponse> update(@PathVariable UUID id, @RequestBody TripRequest request) {
        return ApiResponse.ok(service.update(id, request), "Trip updated");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ApiResponse.ok(null, "Trip deleted");
    }

    @PostMapping("/{id}/dispatch")
    public ApiResponse<TripResponse> dispatch(@PathVariable UUID id) {
        return ApiResponse.ok(service.dispatch(id), "Trip dispatched");
    }

    @PostMapping("/{id}/complete")
    public ApiResponse<TripResponse> complete(@PathVariable UUID id, @Valid @RequestBody CompleteTripRequest request) {
        return ApiResponse.ok(service.complete(id, request), "Trip completed");
    }

    @PostMapping("/{id}/cancel")
    public ApiResponse<TripResponse> cancel(@PathVariable UUID id) {
        return ApiResponse.ok(service.cancel(id), "Trip cancelled");
    }
}
