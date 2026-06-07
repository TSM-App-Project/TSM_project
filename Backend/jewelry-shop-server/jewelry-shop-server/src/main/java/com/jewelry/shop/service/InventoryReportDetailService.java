package com.jewelry.shop.service;

import com.jewelry.shop.dto.InventoryReportDetailRequest;
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

@Service
public class InventoryReportDetailService {
    private final InventoryReportRepository inventoryReportRepository;
    private final InventoryReportDetailRepository inventoryReportDetailRepository;
    private final ProductRepository productRepository;

    public InventoryReportDetailService(InventoryReportRepository inventoryReportRepository,
                                        InventoryReportDetailRepository inventoryReportDetailRepository,
                                        ProductRepository productRepository) {
        this.inventoryReportRepository = inventoryReportRepository;
        this.inventoryReportDetailRepository = inventoryReportDetailRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public InventoryReportDetail create(InventoryReportDetailRequest request) {
        InventoryReport report = resolveReport(request);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        int opening = request.getOpeningStock() != null ? request.getOpeningStock() : 0;
        int inQuantity = request.getInQuantity() != null ? request.getInQuantity() : 0;
        int outQuantity = request.getOutQuantity() != null ? request.getOutQuantity() : 0;
        int closing = request.getClosingStock() != null ? request.getClosingStock() : (opening + inQuantity - outQuantity);

        InventoryReportDetail detail = new InventoryReportDetail();
        detail.setInventoryReport(report);
        detail.setProduct(product);
        detail.setOpeningStock(opening);
        detail.setInQuantity(inQuantity);
        detail.setOutQuantity(outQuantity);
        detail.setClosingStock(closing);
        return inventoryReportDetailRepository.save(detail);
    }

    @Transactional
    public InventoryReportDetail update(Integer id, InventoryReportDetailRequest request) {
        InventoryReportDetail detail = inventoryReportDetailRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report detail not found"));

        if (request.getReportId() != null || (request.getReportMonth() != null && request.getReportYear() != null)) {
            InventoryReport report = resolveReport(request);
            detail.setInventoryReport(report);
        }
        if (request.getProductId() != null) {
            Product product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
            detail.setProduct(product);
        }

        Integer opening = request.getOpeningStock();
        Integer inQuantity = request.getInQuantity();
        Integer outQuantity = request.getOutQuantity();

        if (opening != null) {
            detail.setOpeningStock(opening);
        }
        if (inQuantity != null) {
            detail.setInQuantity(inQuantity);
        }
        if (outQuantity != null) {
            detail.setOutQuantity(outQuantity);
        }

        if (request.getClosingStock() != null) {
            detail.setClosingStock(request.getClosingStock());
        } else {
            int newClosing = detail.getOpeningStock() + detail.getInQuantity() - detail.getOutQuantity();
            detail.setClosingStock(newClosing);
        }

        return inventoryReportDetailRepository.save(detail);
    }

    @Transactional
    public void delete(Integer id) {
        if (!inventoryReportDetailRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Report detail not found");
        }
        inventoryReportDetailRepository.deleteById(id);
    }

    private InventoryReport resolveReport(InventoryReportDetailRequest request) {
        if (request.getReportId() != null) {
            return inventoryReportRepository.findById(request.getReportId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));
        }
        if (request.getReportMonth() == null || request.getReportYear() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Report month and year are required");
        }
        return inventoryReportRepository.findByReportMonthAndReportYear(request.getReportMonth(), request.getReportYear())
                .orElseGet(() -> {
                    InventoryReport report = new InventoryReport();
                    report.setReportMonth(request.getReportMonth());
                    report.setReportYear(request.getReportYear());
                    if (request.getCreatedAt() != null) {
                        report.setCreatedAt(request.getCreatedAt());
                    }
                    return inventoryReportRepository.save(report);
                });
    }
}
