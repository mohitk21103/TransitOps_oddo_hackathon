package com.transitops.common;

import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Paginated collection envelope matching the frontend's `Paginated<T>` shape:
 * { items, total, page, pageSize }.
 */
public record PageResponse<T>(List<T> items, long total, int page, int pageSize) {

    public static <E, T> PageResponse<T> of(Page<E> page, java.util.function.Function<E, T> mapper) {
        return new PageResponse<>(
                page.getContent().stream().map(mapper).toList(),
                page.getTotalElements(),
                page.getNumber(),
                page.getSize());
    }
}
