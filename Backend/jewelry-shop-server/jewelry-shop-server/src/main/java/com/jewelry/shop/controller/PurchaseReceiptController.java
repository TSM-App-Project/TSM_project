package com.jewelry.shop.controller;

import com.jewelry.shop.dto.PurchaseReceiptRequest;
import com.jewelry.shop.entity.PurchaseReceipt;
import com.jewelry.shop.entity.PurchaseReceiptDetail;
import com.jewelry.shop.repository.PurchaseReceiptDetailRepository;
import com.jewelry.shop.repository.PurchaseReceiptRepository;
import com.jewelry.shop.service.PurchaseReceiptService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-receipts")
public class PurchaseReceiptController {
    private final PurchaseReceiptRepository purchaseReceiptRepository;
    private final PurchaseReceiptDetailRepository purchaseReceiptDetailRepository;
    private final PurchaseReceiptService purchaseReceiptService;

    public PurchaseReceiptController(PurchaseReceiptRepository purchaseReceiptRepository,
                                     PurchaseReceiptDetailRepository purchaseReceiptDetailRepository,
                                     PurchaseReceiptService purchaseReceiptService) {
        this.purchaseReceiptRepository = purchaseReceiptRepository;
        this.purchaseReceiptDetailRepository = purchaseReceiptDetailRepository;
        this.purchaseReceiptService = purchaseReceiptService;
    }

    @GetMapping
    public List<PurchaseReceipt> getAllReceipts() {
        return purchaseReceiptRepository.findAll();
    }

    @GetMapping("/{id}")
    public PurchaseReceipt getReceiptById(@PathVariable Integer id) {
        return purchaseReceiptRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Receipt not found"));
    }

    @GetMapping("/{id}/details")
    public List<PurchaseReceiptDetail> getReceiptDetails(@PathVariable Integer id) {
        return purchaseReceiptDetailRepository.findByPurchaseReceipt_PurchaseId(id);
    }

    @PostMapping
    public PurchaseReceipt createReceipt(@Valid @RequestBody PurchaseReceiptRequest request) {
        return purchaseReceiptService.create(request);
    }

    @DeleteMapping("/{id}")
    public void deleteReceipt(@PathVariable Integer id) {
        if (!purchaseReceiptRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Receipt not found");
        }
        purchaseReceiptRepository.deleteById(id);
    }
}
