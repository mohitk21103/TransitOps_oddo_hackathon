package com.transitops.reports;
import com.transitops.reports.dto.*;

import com.transitops.common.ApiResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService service;

    public ReportController(ReportService service) {
        this.service = service;
    }

    @GetMapping("/fleet")
    public ApiResponse<FleetReport> fleet() {
        return ApiResponse.ok(service.fleetReport());
    }

    @GetMapping("/fleet.csv")
    public ResponseEntity<String> fleetCsv() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"fleet-report.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(service.fleetReportCsv());
    }
}
