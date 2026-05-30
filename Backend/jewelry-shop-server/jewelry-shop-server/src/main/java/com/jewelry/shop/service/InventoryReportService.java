package com.jewelry.shop.service;

import com.jewelry.shop.dto.InventoryReportRequest;
import com.jewelry.shop.entity.InventoryReport;
import com.jewelry.shop.entity.InventoryReportDetail;
import com.jewelry.shop.entity.Product;
import com.jewelry.shop.repository.InventoryReportDetailRepository;
import com.jewelry.shop.repository.InventoryReportRepository;
import com.jewelry.shop.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class InventoryReportService {
    private final InventoryReportRepository inventoryReportRepository;
    private final InventoryReportDetailRepository inventoryReportDetailRepository;
    private final ProductRepository productRepository;

    public InventoryReportService(InventoryReportRepository inventoryReportRepository,
                                  InventoryReportDetailRepository inventoryReportDetailRepository,
                                  ProductRepository productRepository) {
        this.inventoryReportRepository = inventoryReportRepository;
        this.inventoryReportDetailRepository = inventoryReportDetailRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public InventoryReport create(InventoryReportRequest request) {
        if (inventoryReportRepository.findByReportMonthAndReportYear(request.getReportMonth(), request.getReportYear()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Report already exists for this period");
        }

        InventoryReport report = new InventoryReport();
        report.setReportMonth(request.getReportMonth());
        report.setReportYear(request.getReportYear());
        if (request.getCreatedAt() != null) {
            report.setCreatedAt(request.getCreatedAt());
        }

        List<InventoryReportDetail> details = new ArrayList<>();
        if (request.getDetails() != null) {
            for (InventoryReportRequest.InventoryReportDetailRequest item : request.getDetails()) {
                Product product = productRepository.findById(item.getProductId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

                int opening = item.getOpeningStock() != null ? item.getOpeningStock() : 0;
                int inQuantity = item.getInQuantity() != null ? item.getInQuantity() : 0;
                int outQuantity = item.getOutQuantity() != null ? item.getOutQuantity() : 0;
                int closing = item.getClosingStock() != null ? item.getClosingStock() : (opening + inQuantity - outQuantity);

                InventoryReportDetail detail = new InventoryReportDetail();
                detail.setInventoryReport(report);
                detail.setProduct(product);
                detail.setOpeningStock(opening);
                detail.setInQuantity(inQuantity);
                detail.setOutQuantity(outQuantity);
                detail.setClosingStock(closing);
                details.add(detail);
            }
        }

        InventoryReport saved = inventoryReportRepository.save(report);
        for (InventoryReportDetail detail : details) {
            detail.setInventoryReport(saved);
        }
        inventoryReportDetailRepository.saveAll(details);
        return saved;
    }
}
