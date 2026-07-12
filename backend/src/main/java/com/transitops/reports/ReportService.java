package com.transitops.reports;

public interface ReportService {

    FleetReport fleetReport();

    /** CSV rendering of the per-vehicle fleet report. */
    String fleetReportCsv();
}
