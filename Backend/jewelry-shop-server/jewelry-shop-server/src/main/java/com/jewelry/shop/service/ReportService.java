package com.jewelry.shop.service;

import com.jewelry.shop.dto.InventoryReportItemDto;
import com.jewelry.shop.dto.RevenueReportDto;
import com.jewelry.shop.entity.Invoice;
import com.jewelry.shop.entity.InvoiceDetail;
import com.jewelry.shop.entity.Product;
import com.jewelry.shop.entity.PurchaseReceipt;
import com.jewelry.shop.entity.PurchaseReceiptDetail;
import com.jewelry.shop.entity.ServiceTicket;
import com.jewelry.shop.repository.InvoiceDetailRepository;
import com.jewelry.shop.repository.InvoiceRepository;
import com.jewelry.shop.repository.ProductRepository;
import com.jewelry.shop.repository.PurchaseReceiptDetailRepository;
import com.jewelry.shop.repository.PurchaseReceiptRepository;
import com.jewelry.shop.repository.ServiceTicketRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final InvoiceRepository invoiceRepository;
    private final ServiceTicketRepository serviceTicketRepository;
    private final PurchaseReceiptRepository purchaseReceiptRepository;
    private final ProductRepository productRepository;
    private final InvoiceDetailRepository invoiceDetailRepository;
    private final PurchaseReceiptDetailRepository purchaseReceiptDetailRepository;

    public ReportService(InvoiceRepository invoiceRepository,
                         ServiceTicketRepository serviceTicketRepository,
                         PurchaseReceiptRepository purchaseReceiptRepository,
                         ProductRepository productRepository,
                         InvoiceDetailRepository invoiceDetailRepository,
                         PurchaseReceiptDetailRepository purchaseReceiptDetailRepository) {
        this.invoiceRepository = invoiceRepository;
        this.serviceTicketRepository = serviceTicketRepository;
        this.purchaseReceiptRepository = purchaseReceiptRepository;
        this.productRepository = productRepository;
        this.invoiceDetailRepository = invoiceDetailRepository;
        this.purchaseReceiptDetailRepository = purchaseReceiptDetailRepository;
    }

    public RevenueReportDto generateRevenueReport(int month, int year) {
        List<Invoice> allInvoices = invoiceRepository.findAll();
        List<ServiceTicket> allTickets = serviceTicketRepository.findAll();
        List<PurchaseReceipt> allPurchases = purchaseReceiptRepository.findAll();

        BigDecimal currentSales = BigDecimal.ZERO;
        BigDecimal currentService = BigDecimal.ZERO;
        BigDecimal currentPurchase = BigDecimal.ZERO;
        BigDecimal prevTotalRevenue = BigDecimal.ZERO;

        int prevMonth = month == 1 ? 12 : month - 1;
        int prevYear = month == 1 ? year - 1 : year;

        for (Invoice inv : allInvoices) {
            if (inv.getCreatedAt() != null) {
                int invM = inv.getCreatedAt().getMonthValue();
                int invY = inv.getCreatedAt().getYear();
                if (invM == month && invY == year) {
                    currentSales = currentSales.add(inv.getTotalAmount() != null ? inv.getTotalAmount() : BigDecimal.ZERO);
                }
                if (invM == prevMonth && invY == prevYear) {
                    prevTotalRevenue = prevTotalRevenue.add(inv.getTotalAmount() != null ? inv.getTotalAmount() : BigDecimal.ZERO);
                }
            }
        }

        for (ServiceTicket tick : allTickets) {
            if (tick.getCreatedAt() != null) {
                int tickM = tick.getCreatedAt().getMonthValue();
                int tickY = tick.getCreatedAt().getYear();
                if (tickM == month && tickY == year) {
                    currentService = currentService.add(tick.getGrandTotal() != null ? tick.getGrandTotal() : BigDecimal.ZERO);
                }
                if (tickM == prevMonth && tickY == prevYear) {
                    prevTotalRevenue = prevTotalRevenue.add(tick.getGrandTotal() != null ? tick.getGrandTotal() : BigDecimal.ZERO);
                }
            }
        }

        for (PurchaseReceipt pur : allPurchases) {
            if (pur.getPurchaseDate() != null) {
                if (pur.getPurchaseDate().getMonthValue() == month && pur.getPurchaseDate().getYear() == year) {
                    currentPurchase = currentPurchase.add(pur.getTotalAmount() != null ? pur.getTotalAmount() : BigDecimal.ZERO);
                }
            }
        }

        BigDecimal totalRevenue = currentSales.add(currentService);
        BigDecimal totalProfit = totalRevenue.subtract(currentPurchase);
        
        String growthStr = "0%";
        if (prevTotalRevenue.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal diff = totalRevenue.subtract(prevTotalRevenue);
            BigDecimal rate = diff.divide(prevTotalRevenue, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
            growthStr = (rate.compareTo(BigDecimal.ZERO) > 0 ? "+" : "") + rate.setScale(2, RoundingMode.HALF_UP).toPlainString() + "%";
        } else if (totalRevenue.compareTo(BigDecimal.ZERO) > 0) {
            growthStr = "+100%"; // if prev month is 0 but current is not
        }

        return new RevenueReportDto(
                String.format("%02d/%d", month, year),
                currentSales,
                currentService,
                currentPurchase,
                totalRevenue,
                totalProfit,
                growthStr
        );
    }

    public List<InventoryReportItemDto> generateInventoryReport(int month, int year) {
        List<Product> products = productRepository.findAll();
        List<InvoiceDetail> allInvDetails = invoiceDetailRepository.findAll();
        List<PurchaseReceiptDetail> allPurDetails = purchaseReceiptDetailRepository.findAll();

        List<InventoryReportItemDto> report = new ArrayList<>();

        for (Product p : products) {
            int currentStock = p.getStockQuantity() != null ? p.getStockQuantity() : 0;
            
            // Calculate sales & purchases IN the selected month
            int soldInMonth = 0;
            int purInMonth = 0;
            
            // Calculate sales & purchases AFTER the selected month
            int soldAfterMonth = 0;
            int purAfterMonth = 0;

            for (InvoiceDetail d : allInvDetails) {
                if (d.getProduct() != null && d.getProduct().getProductId().equals(p.getProductId()) && d.getInvoice() != null && d.getInvoice().getCreatedAt() != null) {
                    int m = d.getInvoice().getCreatedAt().getMonthValue();
                    int y = d.getInvoice().getCreatedAt().getYear();
                    int qty = d.getQuantity() != null ? d.getQuantity() : 0;
                    
                    if (y == year && m == month) {
                        soldInMonth += qty;
                    } else if (y > year || (y == year && m > month)) {
                        soldAfterMonth += qty;
                    }
                }
            }

            for (PurchaseReceiptDetail d : allPurDetails) {
                if (d.getProduct() != null && d.getProduct().getProductId().equals(p.getProductId()) && d.getPurchaseReceipt() != null && d.getPurchaseReceipt().getPurchaseDate() != null) {
                    int m = d.getPurchaseReceipt().getPurchaseDate().getMonthValue();
                    int y = d.getPurchaseReceipt().getPurchaseDate().getYear();
                    int qty = d.getQuantity() != null ? d.getQuantity() : 0;

                    if (y == year && m == month) {
                        purInMonth += qty;
                    } else if (y > year || (y == year && m > month)) {
                        purAfterMonth += qty;
                    }
                }
            }

            // Tồn cuối tháng được chọn = Tồn hiện tại + Đã bán sau tháng - Đã mua sau tháng
            int closingStock = currentStock + soldAfterMonth - purAfterMonth;
            
            // Tồn đầu tháng được chọn = Tồn cuối tháng + Đã bán trong tháng - Đã mua trong tháng
            int openingStock = closingStock + soldInMonth - purInMonth;

            // Optional: unit derived from category code or set default
            String unit = p.getCategory() != null && p.getCategory().getCategoryName() != null 
                    && p.getCategory().getCategoryName().toLowerCase().contains("vàng") ? "Chỉ" : "Cái";

            report.add(new InventoryReportItemDto(
                    p.getProductId(),
                    p.getProductName(),
                    unit,
                    openingStock,
                    purInMonth,
                    soldInMonth,
                    closingStock
            ));
        }

        return report;
    }
}
