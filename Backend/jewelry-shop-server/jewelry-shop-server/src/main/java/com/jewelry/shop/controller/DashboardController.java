package com.jewelry.shop.controller;

import com.jewelry.shop.dto.CategorySalesDto;
import com.jewelry.shop.dto.DashboardSummaryResponse;
import com.jewelry.shop.dto.RecentOrderDto;
import com.jewelry.shop.dto.TopProductDto;
import com.jewelry.shop.entity.Invoice;
import com.jewelry.shop.entity.InvoiceDetail;
import com.jewelry.shop.entity.PurchaseReceipt;
import com.jewelry.shop.repository.CustomerRepository;
import com.jewelry.shop.repository.InvoiceDetailRepository;
import com.jewelry.shop.repository.InvoiceRepository;
import com.jewelry.shop.repository.ProductRepository;
import com.jewelry.shop.repository.PurchaseReceiptRepository;
import com.jewelry.shop.repository.ServiceRepository;
import com.jewelry.shop.repository.SupplierRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final SupplierRepository supplierRepository;
    private final ServiceRepository serviceRepository;
    private final InvoiceRepository invoiceRepository;
    private final InvoiceDetailRepository invoiceDetailRepository;
    private final PurchaseReceiptRepository purchaseReceiptRepository;

    public DashboardController(ProductRepository productRepository,
                               CustomerRepository customerRepository,
                               SupplierRepository supplierRepository,
                               ServiceRepository serviceRepository,
                               InvoiceRepository invoiceRepository,
                               InvoiceDetailRepository invoiceDetailRepository,
                               PurchaseReceiptRepository purchaseReceiptRepository) {
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.supplierRepository = supplierRepository;
        this.serviceRepository = serviceRepository;
        this.invoiceRepository = invoiceRepository;
        this.invoiceDetailRepository = invoiceDetailRepository;
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
        response.setTotalOrders(invoiceRepository.count());
        response.setTotalSales(totalSales);
        response.setTotalPurchases(totalPurchases);
        return response;
    }

    @GetMapping("/recent-invoices")
    public List<RecentOrderDto> getRecentInvoices() {
        List<Invoice> invoices = invoiceRepository.findAll();
        invoices.sort((i1, i2) -> i2.getCreatedAt().compareTo(i1.getCreatedAt()));
        
        return invoices.stream().limit(5).map(invoice -> {
            RecentOrderDto dto = new RecentOrderDto();
            dto.setInvoiceId(invoice.getInvoiceId());
            dto.setCustomerName(invoice.getCustomer() != null ? invoice.getCustomer().getFullName() : "Khách lẻ");
            dto.setTotalAmount(invoice.getTotalAmount() != null ? invoice.getTotalAmount() : BigDecimal.ZERO);
            dto.setDate(invoice.getCreatedAt().toString());
            dto.setStatus("Completed");

            List<InvoiceDetail> details = invoiceDetailRepository.findByInvoice_InvoiceId(invoice.getInvoiceId());
            if (details != null && !details.isEmpty() && details.get(0).getProduct() != null) {
                dto.setFirstProductName(details.get(0).getProduct().getProductName());
                if (details.size() > 1) {
                    dto.setFirstProductName(dto.getFirstProductName() + " & " + (details.size() - 1) + " more");
                }
            } else {
                dto.setFirstProductName("N/A");
            }
            return dto;
        }).collect(Collectors.toList());
    }

    @GetMapping("/top-products")
    public List<TopProductDto> getTopProducts() {
        List<InvoiceDetail> allDetails = invoiceDetailRepository.findAll();
        
        Map<String, TopProductDto> productMap = new HashMap<>();
        
        for (InvoiceDetail detail : allDetails) {
            if (detail.getProduct() != null) {
                String name = detail.getProduct().getProductName();
                int qty = detail.getQuantity() != null ? detail.getQuantity() : 0;
                BigDecimal price = detail.getUnitPrice() != null ? detail.getUnitPrice() : BigDecimal.ZERO;
                BigDecimal total = price.multiply(BigDecimal.valueOf(qty));
                
                TopProductDto dto = productMap.getOrDefault(name, new TopProductDto(name, 0, BigDecimal.ZERO));
                dto.setTotalSold(dto.getTotalSold() + qty);
                dto.setTotalRevenue(dto.getTotalRevenue().add(total));
                productMap.put(name, dto);
            }
        }
        
        List<TopProductDto> topProducts = new ArrayList<>(productMap.values());
        topProducts.sort((p1, p2) -> p2.getTotalSold() == p1.getTotalSold() 
                ? p2.getTotalRevenue().compareTo(p1.getTotalRevenue()) 
                : Long.compare(p2.getTotalSold(), p1.getTotalSold()));
        
        return topProducts.stream().limit(3).collect(Collectors.toList());
    }

    @GetMapping("/sales-by-category")
    public List<CategorySalesDto> getSalesByCategory() {
        List<InvoiceDetail> allDetails = invoiceDetailRepository.findAll();
        
        Map<String, BigDecimal> categoryMap = new HashMap<>();
        
        for (InvoiceDetail detail : allDetails) {
            if (detail.getProduct() != null && detail.getProduct().getCategory() != null) {
                String catName = detail.getProduct().getCategory().getCategoryName();
                int qty = detail.getQuantity() != null ? detail.getQuantity() : 0;
                BigDecimal price = detail.getUnitPrice() != null ? detail.getUnitPrice() : BigDecimal.ZERO;
                BigDecimal total = price.multiply(BigDecimal.valueOf(qty));
                
                categoryMap.put(catName, categoryMap.getOrDefault(catName, BigDecimal.ZERO).add(total));
            }
        }
        
        List<CategorySalesDto> list = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : categoryMap.entrySet()) {
            list.add(new CategorySalesDto(entry.getKey(), entry.getValue()));
        }
        list.sort((c1, c2) -> c2.getTotalSales().compareTo(c1.getTotalSales()));
        
        return list;
    }
}
