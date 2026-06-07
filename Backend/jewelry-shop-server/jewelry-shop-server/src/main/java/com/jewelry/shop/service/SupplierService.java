package com.jewelry.shop.service;

import com.jewelry.shop.dto.SupplierRequest;
import com.jewelry.shop.entity.Supplier;
import com.jewelry.shop.entity.SupplierCategory;
import com.jewelry.shop.repository.SupplierCategoryRepository;
import com.jewelry.shop.repository.SupplierRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class SupplierService {
    private final SupplierRepository supplierRepository;
    private final SupplierCategoryRepository supplierCategoryRepository;

    public SupplierService(SupplierRepository supplierRepository, SupplierCategoryRepository supplierCategoryRepository) {
        this.supplierRepository = supplierRepository;
        this.supplierCategoryRepository = supplierCategoryRepository;
    }

    public List<Supplier> getAll() {
        return supplierRepository.findAll();
    }

    public Supplier getById(Integer id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Supplier not found"));
    }

    @Transactional
    public Supplier create(SupplierRequest request) {
        SupplierCategory category = supplierCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        if (request.getTaxCode() != null && supplierRepository.existsByTaxCode(request.getTaxCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã số thuế đã tồn tại");
        }

        Supplier supplier = Supplier.builder()
                .category(category)
                .supplierName(request.getSupplierName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .taxCode(request.getTaxCode())
                .totalDebt(request.getTotalDebt() != null ? request.getTotalDebt() : java.math.BigDecimal.ZERO)
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .build();
        return supplierRepository.save(supplier);
    }

    @Transactional
    public Supplier update(Integer id, SupplierRequest request) {
        Supplier supplier = getById(id);

        if (request.getCategoryId() != null) {
            SupplierCategory category = supplierCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
            supplier.setCategory(category);
        }
        if (request.getSupplierName() != null) supplier.setSupplierName(request.getSupplierName());
        if (request.getPhone() != null) supplier.setPhone(request.getPhone());
        if (request.getAddress() != null) supplier.setAddress(request.getAddress());
        if (request.getTaxCode() != null) supplier.setTaxCode(request.getTaxCode());
        if (request.getTotalDebt() != null) supplier.setTotalDebt(request.getTotalDebt());
        if (request.getStatus() != null) supplier.setStatus(request.getStatus());

        return supplierRepository.save(supplier);
    }

    @Transactional
    public void delete(Integer id) {
        if (!supplierRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Supplier not found");
        }
        supplierRepository.deleteById(id);
    }
}