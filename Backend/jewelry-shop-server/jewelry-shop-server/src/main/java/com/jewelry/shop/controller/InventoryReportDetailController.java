package com.jewelry.shop.controller;

import com.jewelry.shop.dto.InventoryReportDetailRequest;
import com.jewelry.shop.entity.InventoryReportDetail;
import com.jewelry.shop.repository.InventoryReportDetailRepository;
import com.jewelry.shop.service.InventoryReportDetailService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory-report-details")
public class InventoryReportDetailController {
    private final InventoryReportDetailRepository inventoryReportDetailRepository;
    private final InventoryReportDetailService inventoryReportDetailService;

    public InventoryReportDetailController(InventoryReportDetailRepository inventoryReportDetailRepository,
                                           InventoryReportDetailService inventoryReportDetailService) {
        this.inventoryReportDetailRepository = inventoryReportDetailRepository;
        this.inventoryReportDetailService = inventoryReportDetailService;
    }

    @GetMapping
    public List<InventoryReportDetail> getAllDetails() {
        return inventoryReportDetailRepository.findAll();
    }

    @PostMapping
    public InventoryReportDetail createDetail(@RequestBody InventoryReportDetailRequest request) {
        return inventoryReportDetailService.create(request);
    }

    @PutMapping("/{id}")
    public InventoryReportDetail updateDetail(@PathVariable Integer id, @RequestBody InventoryReportDetailRequest request) {
        return inventoryReportDetailService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteDetail(@PathVariable Integer id) {
        inventoryReportDetailService.delete(id);
    }
}
