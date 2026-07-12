package com.transitops.trip;
import com.transitops.trip.dto.*;

import com.transitops.common.CrudService;

import java.util.UUID;

/**
 * Trip lifecycle. CRUD plus the guarded state transitions that cascade
 * vehicle/driver status per the mandatory business rules.
 */
public interface TripService extends CrudService<TripResponse, TripRequest, TripRequest> {

    TripResponse dispatch(UUID id);

    TripResponse complete(UUID id, CompleteTripRequest request);

    TripResponse cancel(UUID id);
}
