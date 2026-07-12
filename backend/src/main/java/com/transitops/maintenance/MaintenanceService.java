package com.transitops.maintenance;

import com.transitops.common.CrudService;

import java.util.UUID;

public interface MaintenanceService extends CrudService<MaintenanceResponse, MaintenanceRequest, MaintenanceRequest> {

    /** Close a record and restore the vehicle to Available (unless Retired). */
    MaintenanceResponse close(UUID id);
}
