package com.jewelry.shop.service;

import com.jewelry.shop.dto.InvoiceRequest;
import com.jewelry.shop.entity.Customer;
import com.jewelry.shop.entity.Invoice;
import com.jewelry.shop.entity.InvoiceDetail;
import com.jewelry.shop.entity.Product;
import com.jewelry.shop.entity.User;
import com.jewelry.shop.repository.CustomerRepository;
import com.jewelry.shop.repository.InvoiceDetailRepository;
import com.jewelry.shop.repository.InvoiceRepository;
import com.jewelry.shop.repository.ProductRepository;
import com.jewelry.shop.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final InvoiceDetailRepository invoiceDetailRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    public InvoiceService(InvoiceRepository invoiceRepository,
                          InvoiceDetailRepository invoiceDetailRepository,
                          ProductRepository productRepository,
                          UserRepository userRepository,
                          CustomerRepository customerRepository) {
        this.invoiceRepository = invoiceRepository;
        this.invoiceDetailRepository = invoiceDetailRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional
    public Invoice create(InvoiceRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Customer customer = null;
        if (request.getCustomerId() != null) {
            customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
        }

        Invoice invoice = new Invoice();
        invoice.setUser(user);
        invoice.setCustomer(customer);
        if (request.getCreatedAt() != null) {
            invoice.setCreatedAt(request.getCreatedAt());
        }

        BigDecimal total = BigDecimal.ZERO;
        List<InvoiceDetail> details = new ArrayList<>();
        List<Product> updatedProducts = new ArrayList<>();

        if (request.getItems() != null) {
            for (InvoiceRequest.InvoiceItemRequest item : request.getItems()) {
                Product product = productRepository.findById(item.getProductId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
                int quantity = item.getQuantity() != null ? item.getQuantity() : 0;
                BigDecimal unitPrice = item.getUnitPrice() != null ? item.getUnitPrice() : BigDecimal.ZERO;

                total = total.add(unitPrice.multiply(BigDecimal.valueOf(quantity)));

                Integer stock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
                product.setStockQuantity(stock - quantity);
                updatedProducts.add(product);

                InvoiceDetail detail = new InvoiceDetail();
                detail.setInvoice(invoice);
                detail.setProduct(product);
                detail.setQuantity(quantity);
                detail.setUnitPrice(unitPrice);
                details.add(detail);
            }
        }

        invoice.setTotalAmount(total);
        Invoice saved = invoiceRepository.save(invoice);
        for (InvoiceDetail detail : details) {
            detail.setInvoice(saved);
        }
        invoiceDetailRepository.saveAll(details);
        productRepository.saveAll(updatedProducts);
        return saved;
    }
}
