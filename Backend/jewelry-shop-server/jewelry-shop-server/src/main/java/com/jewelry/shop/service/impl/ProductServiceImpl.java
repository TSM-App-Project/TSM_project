package com.jewelry.shop.service.impl;

import com.jewelry.shop.dto.ProductRequest;
import com.jewelry.shop.entity.Product;
import com.jewelry.shop.entity.ProductCategory;
import com.jewelry.shop.entity.Supplier;
import com.jewelry.shop.exception.ResourceNotFoundException;
import com.jewelry.shop.repository.ProductCategoryRepository;
import com.jewelry.shop.repository.ProductRepository;
import com.jewelry.shop.repository.SupplierRepository;
import com.jewelry.shop.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final SupplierRepository supplierRepository;

    public ProductServiceImpl(ProductRepository productRepository, ProductCategoryRepository productCategoryRepository, SupplierRepository supplierRepository) {
        this.productRepository = productRepository;
        this.productCategoryRepository = productCategoryRepository;
        this.supplierRepository = supplierRepository;
    }

    @Override
    @Transactional
    public Product create(ProductRequest request) {
        ProductCategory category = productCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Product product = new Product();
        product.setCategory(category);
        product.setProductName(request.getProductName());
        product.setWeight(request.getWeight());
        product.setLaborCost(request.getLaborCost());
        product.setPurchasePrice(request.getPurchasePrice());
        product.setStockQuantity(request.getStockQuantity() == null ? 0 : request.getStockQuantity());
        product.setStatus(request.getStatus() == null ? "ACTIVE" : request.getStatus());

        if (request.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
            product.setSupplier(supplier);
        }

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product update(Integer id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (request.getCategoryId() != null) {
            ProductCategory category = productCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }
        if (request.getProductName() != null) {
            product.setProductName(request.getProductName());
        }
        if (request.getWeight() != null) {
            product.setWeight(request.getWeight());
        }
        if (request.getLaborCost() != null) {
            product.setLaborCost(request.getLaborCost());
        }
        if (request.getPurchasePrice() != null) {
            product.setPurchasePrice(request.getPurchasePrice());
        }
        if (request.getStockQuantity() != null) {
            product.setStockQuantity(request.getStockQuantity());
        }
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }
        if (request.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
            product.setSupplier(supplier);
        }
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        productRepository.deleteById(id);
    }
}
