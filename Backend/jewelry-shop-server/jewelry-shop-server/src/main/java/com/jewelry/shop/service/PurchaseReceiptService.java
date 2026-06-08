package com.jewelry.shop.service;

import com.jewelry.shop.dto.PurchaseReceiptRequest;
import com.jewelry.shop.entity.Product;
import com.jewelry.shop.entity.PurchaseReceipt;
import com.jewelry.shop.entity.PurchaseReceiptDetail;
import com.jewelry.shop.entity.Supplier;
import com.jewelry.shop.entity.User;
import com.jewelry.shop.repository.ProductRepository;
import com.jewelry.shop.repository.PurchaseReceiptDetailRepository;
import com.jewelry.shop.repository.PurchaseReceiptRepository;
import com.jewelry.shop.repository.SupplierRepository;
import com.jewelry.shop.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class PurchaseReceiptService {
    private final PurchaseReceiptRepository purchaseReceiptRepository;
    private final PurchaseReceiptDetailRepository purchaseReceiptDetailRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;

    public PurchaseReceiptService(PurchaseReceiptRepository purchaseReceiptRepository,
                                  PurchaseReceiptDetailRepository purchaseReceiptDetailRepository,
                                  ProductRepository productRepository,
                                  SupplierRepository supplierRepository,
                                  UserRepository userRepository) {
        this.purchaseReceiptRepository = purchaseReceiptRepository;
        this.purchaseReceiptDetailRepository = purchaseReceiptDetailRepository;
        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public PurchaseReceipt create(PurchaseReceiptRequest request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Supplier not found"));
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        PurchaseReceipt receipt = new PurchaseReceipt();
        receipt.setSupplier(supplier);
        receipt.setUser(user);
        if (request.getPurchaseDate() != null) {
            receipt.setPurchaseDate(request.getPurchaseDate());
        }

        BigDecimal total = BigDecimal.ZERO;
        List<PurchaseReceiptDetail> details = new ArrayList<>();
        List<Product> updatedProducts = new ArrayList<>();

        if (request.getItems() != null) {
            for (PurchaseReceiptRequest.PurchaseItemRequest item : request.getItems()) {
                Product product = productRepository.findById(item.getProductId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
                int quantity = item.getQuantity() != null ? item.getQuantity() : 0;
                BigDecimal purchasePrice = item.getPurchasePrice() != null ? item.getPurchasePrice() : BigDecimal.ZERO;

                total = total.add(purchasePrice.multiply(BigDecimal.valueOf(quantity)));

                Integer stock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
                product.setStockQuantity(stock + quantity);
                updatedProducts.add(product);

                PurchaseReceiptDetail detail = new PurchaseReceiptDetail();
                detail.setPurchaseReceipt(receipt);
                detail.setProduct(product);
                detail.setQuantity(quantity);
                detail.setPurchasePrice(purchasePrice);
                details.add(detail);
            }
        }

        receipt.setTotalAmount(total);
        PurchaseReceipt saved = purchaseReceiptRepository.save(receipt);
        for (PurchaseReceiptDetail detail : details) {
            detail.setPurchaseReceipt(saved);
        }
        purchaseReceiptDetailRepository.saveAll(details);
        productRepository.saveAll(updatedProducts);
        return saved;
    }

    @Transactional
    public PurchaseReceipt update(Integer id, PurchaseReceiptRequest request) {
        PurchaseReceipt receipt = purchaseReceiptRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "PurchaseReceipt not found"));

        if (request.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Supplier not found"));
            receipt.setSupplier(supplier);
        }
        
        if (request.getPurchaseDate() != null) {
            receipt.setPurchaseDate(request.getPurchaseDate());
        }

        // Restore old stock (subtract what was added)
        List<PurchaseReceiptDetail> oldDetails = purchaseReceiptDetailRepository.findByPurchaseReceipt_PurchaseId(id);
        List<Product> updatedProducts = new ArrayList<>();
        for (PurchaseReceiptDetail detail : oldDetails) {
            Product product = detail.getProduct();
            product.setStockQuantity((product.getStockQuantity() == null ? 0 : product.getStockQuantity()) - detail.getQuantity());
            updatedProducts.add(product);
        }
        purchaseReceiptDetailRepository.deleteAll(oldDetails);

        // Process new details
        BigDecimal total = BigDecimal.ZERO;
        List<PurchaseReceiptDetail> newDetails = new ArrayList<>();
        
        if (request.getItems() != null) {
            for (PurchaseReceiptRequest.PurchaseItemRequest item : request.getItems()) {
                Product product = productRepository.findById(item.getProductId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
                int quantity = item.getQuantity() != null ? item.getQuantity() : 0;
                BigDecimal purchasePrice = item.getPurchasePrice() != null ? item.getPurchasePrice() : BigDecimal.ZERO;

                total = total.add(purchasePrice.multiply(BigDecimal.valueOf(quantity)));

                product.setStockQuantity((product.getStockQuantity() == null ? 0 : product.getStockQuantity()) + quantity);
                updatedProducts.add(product);

                PurchaseReceiptDetail detail = new PurchaseReceiptDetail();
                detail.setPurchaseReceipt(receipt);
                detail.setProduct(product);
                detail.setQuantity(quantity);
                detail.setPurchasePrice(purchasePrice);
                newDetails.add(detail);
            }
        }

        receipt.setTotalAmount(total);
        PurchaseReceipt saved = purchaseReceiptRepository.save(receipt);
        purchaseReceiptDetailRepository.saveAll(newDetails);
        productRepository.saveAll(updatedProducts);
        return saved;
    }

    @Transactional
    public void delete(Integer id) {
        PurchaseReceipt receipt = purchaseReceiptRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "PurchaseReceipt not found"));
        
        // Restore old stock (subtract what was added)
        List<PurchaseReceiptDetail> oldDetails = purchaseReceiptDetailRepository.findByPurchaseReceipt_PurchaseId(id);
        List<Product> updatedProducts = new ArrayList<>();
        for (PurchaseReceiptDetail detail : oldDetails) {
            Product product = detail.getProduct();
            product.setStockQuantity((product.getStockQuantity() == null ? 0 : product.getStockQuantity()) - detail.getQuantity());
            updatedProducts.add(product);
        }
        productRepository.saveAll(updatedProducts);
        purchaseReceiptDetailRepository.deleteAll(oldDetails);
        purchaseReceiptRepository.delete(receipt);
    }
}
