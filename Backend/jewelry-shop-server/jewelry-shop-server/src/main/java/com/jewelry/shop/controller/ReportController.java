package com.jewelry.shop.controller;

import com.jewelry.shop.dto.InventoryReportItemDto;
import com.jewelry.shop.dto.RevenueReportDto;
import com.jewelry.shop.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/revenue")
    public ResponseEntity<RevenueReportDto> getRevenueReport(
            @RequestParam int month,
            @RequestParam int year) {
        RevenueReportDto report = reportService.generateRevenueReport(month, year);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/inventory")
    public ResponseEntity<List<InventoryReportItemDto>> getInventoryReport(
            @RequestParam int month,
            @RequestParam int year) {
        List<InventoryReportItemDto> report = reportService.generateInventoryReport(month, year);
        return ResponseEntity.ok(report);
    }
}
