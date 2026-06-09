package com.jewelry.shop.controller;

import com.jewelry.shop.dto.SupplierCategoryRequest;
import com.jewelry.shop.entity.SupplierCategory;
import com.jewelry.shop.service.SupplierCategoryService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supplier-categories")
@CrossOrigin("*")
public class SupplierCategoryController {

    private final SupplierCategoryService supplierCategoryService;

    public SupplierCategoryController(SupplierCategoryService supplierCategoryService) {
        this.supplierCategoryService = supplierCategoryService;
    }

    @GetMapping
    public List<SupplierCategory> getAllCategories() {
        return supplierCategoryService.getAll();
    }

    @GetMapping("/{id}")
    public SupplierCategory getCategoryById(@PathVariable Integer id) {
        return supplierCategoryService.getById(id);
    }

    @PostMapping
    public SupplierCategory createCategory(@Valid @RequestBody SupplierCategoryRequest request) {
        return supplierCategoryService.create(request);
    }

    @PutMapping("/{id}")
    public SupplierCategory updateCategory(@PathVariable Integer id, @Valid @RequestBody SupplierCategoryRequest request) {
        return supplierCategoryService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Integer id) {
        supplierCategoryService.delete(id);
    }
}