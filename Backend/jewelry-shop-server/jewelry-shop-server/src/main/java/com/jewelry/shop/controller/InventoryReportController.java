package com.jewelry.shop.controller;

import com.jewelry.shop.dto.InventoryReportRequest;
import com.jewelry.shop.entity.InventoryReport;
import com.jewelry.shop.entity.InventoryReportDetail;
import com.jewelry.shop.repository.InventoryReportDetailRepository;
import com.jewelry.shop.repository.InventoryReportRepository;
import com.jewelry.shop.service.InventoryReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/inventory-reports")
public class InventoryReportController {
    private final InventoryReportRepository inventoryReportRepository;
    private final InventoryReportDetailRepository inventoryReportDetailRepository;
    private final InventoryReportService inventoryReportService;

    public InventoryReportController(InventoryReportRepository inventoryReportRepository,
                                     InventoryReportDetailRepository inventoryReportDetailRepository,
                                     InventoryReportService inventoryReportService) {
        this.inventoryReportRepository = inventoryReportRepository;
        this.inventoryReportDetailRepository = inventoryReportDetailRepository;
        this.inventoryReportService = inventoryReportService;
    }

    @GetMapping
    public List<InventoryReport> getAllReports() {
        return inventoryReportRepository.findAll();
    }

    @GetMapping("/{id}")
    public InventoryReport getReportById(@PathVariable Integer id) {
        return inventoryReportRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));
    }

    @GetMapping("/{id}/details")
    public List<InventoryReportDetail> getReportDetails(@PathVariable Integer id) {
        return inventoryReportDetailRepository.findByInventoryReport_ReportId(id);
    }

    @PostMapping
    public InventoryReport createReport(@Valid @RequestBody InventoryReportRequest request) {
        return inventoryReportService.create(request);
    }
}
