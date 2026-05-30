package com.jewelry.shop.controller;

import com.jewelry.shop.dto.DashboardSummaryResponse;
import com.jewelry.shop.entity.Invoice;
import com.jewelry.shop.entity.PurchaseReceipt;
import com.jewelry.shop.repository.CustomerRepository;
import com.jewelry.shop.repository.InvoiceRepository;
import com.jewelry.shop.repository.ProductRepository;
import com.jewelry.shop.repository.PurchaseReceiptRepository;
import com.jewelry.shop.repository.ServiceRepository;
import com.jewelry.shop.repository.SupplierRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final SupplierRepository supplierRepository;
    private final ServiceRepository serviceRepository;
    private final InvoiceRepository invoiceRepository;
    private final PurchaseReceiptRepository purchaseReceiptRepository;

    public DashboardController(ProductRepository productRepository,
                               CustomerRepository customerRepository,
                               SupplierRepository supplierRepository,
                               ServiceRepository serviceRepository,
                               InvoiceRepository invoiceRepository,
                               PurchaseReceiptRepository purchaseReceiptRepository) {
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.supplierRepository = supplierRepository;
        this.serviceRepository = serviceRepository;
        this.invoiceRepository = invoiceRepository;
        this.purchaseReceiptRepository = purchaseReceiptRepository;
    }

    @GetMapping("/summary")
    public DashboardSummaryResponse getSummary() {
        BigDecimal totalSales = invoiceRepository.findAll().stream()
                .map(Invoice::getTotalAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPurchases = purchaseReceiptRepository.findAll().stream()
                .map(PurchaseReceipt::getTotalAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        DashboardSummaryResponse response = new DashboardSummaryResponse();
        response.setTotalProducts(productRepository.count());
        response.setTotalCustomers(customerRepository.count());
        response.setTotalSuppliers(supplierRepository.count());
        response.setTotalServices(serviceRepository.count());
        response.setTotalSales(totalSales);
        response.setTotalPurchases(totalPurchases);
        return response;
    }
}
