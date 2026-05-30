package com.jewelry.shop.controller;

import com.jewelry.shop.dto.ProductCategoryRequest;
import com.jewelry.shop.entity.ProductCategory;
import com.jewelry.shop.repository.ProductCategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/product-categories")
public class ProductCategoryController {
    private final ProductCategoryRepository productCategoryRepository;

    public ProductCategoryController(ProductCategoryRepository productCategoryRepository) {
        this.productCategoryRepository = productCategoryRepository;
    }

    @GetMapping
    public List<ProductCategory> getAllCategories() {
        return productCategoryRepository.findAll();
    }

    @GetMapping("/{id}")
    public ProductCategory getCategoryById(@PathVariable Integer id) {
        return productCategoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
    }

    @PostMapping
    public ProductCategory createCategory(@RequestBody ProductCategoryRequest request) {
        ProductCategory category = new ProductCategory();
        category.setCategoryName(request.getCategoryName());
        category.setUnitName(request.getUnitName());
        category.setProfitPercentage(request.getProfitPercentage());
        return productCategoryRepository.save(category);
    }

    @PutMapping("/{id}")
    public ProductCategory updateCategory(@PathVariable Integer id, @RequestBody ProductCategoryRequest request) {
        ProductCategory category = productCategoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        if (request.getCategoryName() != null) {
            category.setCategoryName(request.getCategoryName());
        }
        if (request.getUnitName() != null) {
            category.setUnitName(request.getUnitName());
        }
        if (request.getProfitPercentage() != null) {
            category.setProfitPercentage(request.getProfitPercentage());
        }
        return productCategoryRepository.save(category);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Integer id) {
        if (!productCategoryRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found");
        }
        productCategoryRepository.deleteById(id);
    }
}
