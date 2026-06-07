package com.jewelry.shop.controller;

import com.jewelry.shop.dto.ProductCategoryRequest;
import com.jewelry.shop.entity.ProductCategory;
import com.jewelry.shop.service.ProductCategoryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/product-categories")
@CrossOrigin("*")
public class ProductCategoryController {

    private final ProductCategoryService productCategoryService;

    public ProductCategoryController(ProductCategoryService productCategoryService) {
        this.productCategoryService = productCategoryService;
    }

    @GetMapping
    public List<ProductCategory> getAllCategories() {
        return productCategoryService.getAll();
    }

    @GetMapping("/{id}")
    public ProductCategory getCategoryById(@PathVariable Integer id) {
        return productCategoryService.getById(id);
    }

    @PostMapping
    public ProductCategory createCategory(@Valid @RequestBody ProductCategoryRequest request) {
        return productCategoryService.create(request);
    }

    @PutMapping("/{id}")
    public ProductCategory updateCategory(@PathVariable Integer id, @Valid @RequestBody ProductCategoryRequest request) {
        return productCategoryService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Integer id) {
        productCategoryService.delete(id);
    }
}