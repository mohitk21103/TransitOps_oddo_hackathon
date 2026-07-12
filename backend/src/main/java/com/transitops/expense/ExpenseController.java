package com.transitops.expense;
import com.transitops.expense.dto.*;

import com.transitops.common.ApiResponse;
import com.transitops.common.ListQuery;
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
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<PageResponse<ExpenseResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int pageSize) {
        return ApiResponse.ok(service.list(new ListQuery(search, sortBy, sortDir, page, pageSize)));
    }

    @GetMapping("/{id}")
    public ApiResponse<ExpenseResponse> get(@PathVariable UUID id) {
        return ApiResponse.ok(service.get(id));
    }

    @PostMapping
    public ApiResponse<ExpenseResponse> create(@Valid @RequestBody ExpenseRequest request) {
        return ApiResponse.ok(service.create(request), "Expense recorded");
    }

    @PatchMapping("/{id}")
    public ApiResponse<ExpenseResponse> update(@PathVariable UUID id, @RequestBody ExpenseRequest request) {
        return ApiResponse.ok(service.update(id, request), "Expense updated");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ApiResponse.ok(null, "Expense deleted");
    }
}
