package com.transitops.reports;
import com.transitops.reports.dto.*;

public interface ReportService {

    FleetReport fleetReport();

    /** CSV rendering of the per-vehicle fleet report. */
    String fleetReportCsv();
}
