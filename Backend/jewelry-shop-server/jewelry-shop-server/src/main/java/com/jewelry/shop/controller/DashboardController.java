package com.jewelry.shop.controller;

import com.jewelry.shop.dto.CategorySalesDto;
import com.jewelry.shop.dto.DailyRevenueDto;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
        List<Invoice> allInvoices = invoiceRepository.findAll();
        List<PurchaseReceipt> allReceipts = purchaseReceiptRepository.findAll();

        BigDecimal totalSales = allInvoices.stream()
                .map(Invoice::getTotalAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPurchases = allReceipts.stream()
                .map(PurchaseReceipt::getTotalAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate growth: current month vs previous month
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfCurrentMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime startOfPreviousMonth = startOfCurrentMonth.minusMonths(1);

        BigDecimal currentMonthSales = allInvoices.stream()
                .filter(i -> i.getCreatedAt() != null && !i.getCreatedAt().isBefore(startOfCurrentMonth))
                .map(Invoice::getTotalAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal previousMonthSales = allInvoices.stream()
                .filter(i -> i.getCreatedAt() != null
                        && !i.getCreatedAt().isBefore(startOfPreviousMonth)
                        && i.getCreatedAt().isBefore(startOfCurrentMonth))
                .map(Invoice::getTotalAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long currentMonthOrders = allInvoices.stream()
                .filter(i -> i.getCreatedAt() != null && !i.getCreatedAt().isBefore(startOfCurrentMonth))
                .count();

        long previousMonthOrders = allInvoices.stream()
                .filter(i -> i.getCreatedAt() != null
                        && !i.getCreatedAt().isBefore(startOfPreviousMonth)
                        && i.getCreatedAt().isBefore(startOfCurrentMonth))
                .count();

        DashboardSummaryResponse response = new DashboardSummaryResponse();
        response.setTotalProducts(productRepository.count());
        response.setTotalCustomers(customerRepository.count());
        response.setTotalSuppliers(supplierRepository.count());
        response.setTotalServices(serviceRepository.count());
        response.setTotalOrders(invoiceRepository.count());
        response.setTotalSales(totalSales);
        response.setTotalPurchases(totalPurchases);

        // Growth percentages
        response.setSalesGrowth(calculateGrowth(currentMonthSales, previousMonthSales));
        response.setOrdersGrowth(calculateGrowthLong(currentMonthOrders, previousMonthOrders));
        response.setCustomersGrowth(0); // Customers don't have createdAt, so set to 0
        response.setProductsGrowth(0);  // Products don't track monthly change

        return response;
    }

    private double calculateGrowth(BigDecimal current, BigDecimal previous) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            return current != null && current.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }
        return current.subtract(previous)
                .multiply(BigDecimal.valueOf(100))
                .divide(previous, 1, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private double calculateGrowthLong(long current, long previous) {
        if (previous == 0) {
            return current > 0 ? 100.0 : 0.0;
        }
        return Math.round((double) (current - previous) / previous * 1000.0) / 10.0;
    }

    /**
     * Returns daily revenue data for the chart.
     * @param days Number of past days to include (default 30)
     */
    @GetMapping("/daily-revenue")
    public List<DailyRevenueDto> getDailyRevenue(@RequestParam(defaultValue = "0") int days) {
        List<Invoice> allInvoices = invoiceRepository.findAll();
        List<PurchaseReceipt> allReceipts = purchaseReceiptRepository.findAll();

        LocalDate endDate = LocalDate.now();
        LocalDate startDate;

        if (days <= 0) {
            // All time: find the earliest date from invoices and receipts
            LocalDate earliestInvoice = allInvoices.stream()
                    .filter(i -> i.getCreatedAt() != null)
                    .map(i -> i.getCreatedAt().toLocalDate())
                    .min(LocalDate::compareTo)
                    .orElse(endDate);
            LocalDate earliestReceipt = allReceipts.stream()
                    .filter(r -> r.getPurchaseDate() != null)
                    .map(r -> r.getPurchaseDate().toLocalDate())
                    .min(LocalDate::compareTo)
                    .orElse(endDate);
            startDate = earliestInvoice.isBefore(earliestReceipt) ? earliestInvoice : earliestReceipt;
        } else {
            startDate = endDate.minusDays(days - 1);
        }

        // Group invoices by date
        Map<LocalDate, BigDecimal> revenueByDate = allInvoices.stream()
                .filter(i -> i.getCreatedAt() != null)
                .filter(i -> {
                    LocalDate d = i.getCreatedAt().toLocalDate();
                    return !d.isBefore(startDate) && !d.isAfter(endDate);
                })
                .collect(Collectors.groupingBy(
                        i -> i.getCreatedAt().toLocalDate(),
                        Collectors.reducing(BigDecimal.ZERO,
                                i -> i.getTotalAmount() != null ? i.getTotalAmount() : BigDecimal.ZERO,
                                BigDecimal::add)
                ));

        // Group purchases by date
        Map<LocalDate, BigDecimal> purchasesByDate = allReceipts.stream()
                .filter(r -> r.getPurchaseDate() != null)
                .filter(r -> {
                    LocalDate d = r.getPurchaseDate().toLocalDate();
                    return !d.isBefore(startDate) && !d.isAfter(endDate);
                })
                .collect(Collectors.groupingBy(
                        r -> r.getPurchaseDate().toLocalDate(),
                        Collectors.reducing(BigDecimal.ZERO,
                                r -> r.getTotalAmount() != null ? r.getTotalAmount() : BigDecimal.ZERO,
                                BigDecimal::add)
                ));

        // Build result list for all days in range (fill gaps with 0)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");
        List<DailyRevenueDto> result = new ArrayList<>();
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            result.add(new DailyRevenueDto(
                    date.format(formatter),
                    revenueByDate.getOrDefault(date, BigDecimal.ZERO),
                    purchasesByDate.getOrDefault(date, BigDecimal.ZERO)
            ));
        }

        return result;
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
