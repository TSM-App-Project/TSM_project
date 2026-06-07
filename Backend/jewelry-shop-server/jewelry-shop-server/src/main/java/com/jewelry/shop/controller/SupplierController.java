package com.jewelry.shop.controller;

import com.jewelry.shop.dto.SupplierRequest;
import com.jewelry.shop.entity.Supplier;
import com.jewelry.shop.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin("*")
@PreAuthorize("hasAuthority('Quản lý')") // Phân quyền module nhà cung cấp
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierService.getAll();
    }

    @GetMapping("/{id}")
    public Supplier getSupplierById(@PathVariable Integer id) {
        return supplierService.getById(id);
    }

    @PostMapping
    public Supplier createSupplier(@Valid @RequestBody SupplierRequest request) {
        return supplierService.create(request);
    }

    @PutMapping("/{id}")
    public Supplier updateSupplier(@PathVariable Integer id, @Valid @RequestBody SupplierRequest request) {
        return supplierService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteSupplier(@PathVariable Integer id) {
        supplierService.delete(id);
    }
}