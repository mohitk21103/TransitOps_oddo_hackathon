package com.transitops.common;

import java.util.UUID;

/**
 * Generalised CRUD contract shared by every feature service.
 *
 * @param <R> response DTO type
 * @param <C> create-request type
 * @param <U> update-request type (partial)
 */
public interface CrudService<R, C, U> {

    PageResponse<R> list(ListQuery query);

    R get(UUID id);

    R create(C request);

    R update(UUID id, U request);

    void delete(UUID id);
}
