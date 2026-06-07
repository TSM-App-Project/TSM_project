package com.jewelry.shop.service;

import com.jewelry.shop.dto.SupplierCategoryRequest;
import com.jewelry.shop.entity.SupplierCategory;
import com.jewelry.shop.repository.SupplierCategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class SupplierCategoryService {
    private final SupplierCategoryRepository supplierCategoryRepository;

    public SupplierCategoryService(SupplierCategoryRepository supplierCategoryRepository) {
        this.supplierCategoryRepository = supplierCategoryRepository;
    }

    public List<SupplierCategory> getAll() {
        return supplierCategoryRepository.findAll();
    }

    public SupplierCategory getById(Integer id) {
        return supplierCategoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục nhà cung cấp"));
    }

    @Transactional
    public SupplierCategory create(SupplierCategoryRequest request) {
        if (supplierCategoryRepository.existsByCategoryName(request.getCategoryName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên danh mục đã tồn tại");
        }
        SupplierCategory category = SupplierCategory.builder()
                .categoryName(request.getCategoryName())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .build();
        return supplierCategoryRepository.save(category);
    }

    @Transactional
    public SupplierCategory update(Integer id, SupplierCategoryRequest request) {
        SupplierCategory category = getById(id);
        if (request.getCategoryName() != null && !category.getCategoryName().equals(request.getCategoryName())) {
            if (supplierCategoryRepository.existsByCategoryName(request.getCategoryName())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên danh mục đã tồn tại");
            }
            category.setCategoryName(request.getCategoryName());
        }
        if (request.getDescription() != null) category.setDescription(request.getDescription());
        if (request.getStatus() != null) category.setStatus(request.getStatus());

        return supplierCategoryRepository.save(category);
    }

    @Transactional
    public void delete(Integer id) {
        if (!supplierCategoryRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục");
        }
        supplierCategoryRepository.deleteById(id);
    }
}