package com.transitops.vehicle;

import com.transitops.common.CrudService;

import java.util.List;

/**
 * Vehicle registry operations. Generalised CRUD plus dispatch-eligibility.
 */
public interface VehicleService extends CrudService<VehicleResponse, VehicleRequest, VehicleRequest> {

    /** Vehicles eligible for dispatch (Available only — excludes On Trip/In Shop/Retired). */
    List<VehicleResponse> listDispatchable();
}
