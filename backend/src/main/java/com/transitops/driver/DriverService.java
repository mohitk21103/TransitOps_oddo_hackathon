package com.transitops.driver;
import com.transitops.driver.dto.*;

import com.transitops.common.CrudService;

import java.util.List;

public interface DriverService extends CrudService<DriverResponse, DriverRequest, DriverRequest> {

    /** Drivers eligible for assignment: Available, not Suspended, licence unexpired. */
    List<DriverResponse> listAssignable();
}
