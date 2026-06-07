package com.jewelry.shop.controller;

import com.jewelry.shop.dto.DebtPaymentRequest;
import com.jewelry.shop.entity.DebtPayment;
import com.jewelry.shop.service.DebtPaymentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fund-management")
@CrossOrigin("*")
public class DebtPaymentController {

    private final DebtPaymentService debtPaymentService;

    public DebtPaymentController(DebtPaymentService debtPaymentService) {
        this.debtPaymentService = debtPaymentService;
    }

    @GetMapping
    public List<DebtPayment> getAllPayments() {
        return debtPaymentService.getAll();
    }

    @GetMapping("/{id}")
    public DebtPayment getPaymentById(@PathVariable Integer id) {
        return debtPaymentService.getById(id);
    }

    @PostMapping
    public DebtPayment createPayment(@Valid @RequestBody DebtPaymentRequest request) {
        return debtPaymentService.create(request);
    }
}