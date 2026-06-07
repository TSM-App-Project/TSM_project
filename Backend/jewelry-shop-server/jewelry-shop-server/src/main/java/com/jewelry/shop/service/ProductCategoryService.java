package com.jewelry.shop.service;

import com.jewelry.shop.dto.ProductCategoryRequest;
import com.jewelry.shop.entity.ProductCategory;
import com.jewelry.shop.repository.ProductCategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductCategoryService {
    private final ProductCategoryRepository productCategoryRepository;

    public ProductCategoryService(ProductCategoryRepository productCategoryRepository) {
        this.productCategoryRepository = productCategoryRepository;
    }

    public List<ProductCategory> getAll() {
        return productCategoryRepository.findAll();
    }

    public ProductCategory getById(Integer id) {
        return productCategoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
    }

    @Transactional
    public ProductCategory create(ProductCategoryRequest request) {
        ProductCategory category = new ProductCategory();
        category.setCategoryName(request.getCategoryName());
        category.setUnitName(request.getUnitName());
        category.setProfitPercentage(request.getProfitPercentage() == null ? java.math.BigDecimal.ZERO : request.getProfitPercentage());
        return productCategoryRepository.save(category);
    }

    @Transactional
    public ProductCategory update(Integer id, ProductCategoryRequest request) {
        ProductCategory category = getById(id);
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

    @Transactional
    public void delete(Integer id) {
        if (!productCategoryRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found");
        }
        productCategoryRepository.deleteById(id);
    }
}
