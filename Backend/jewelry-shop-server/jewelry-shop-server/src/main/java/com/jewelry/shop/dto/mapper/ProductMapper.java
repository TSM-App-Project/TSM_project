package com.jewelry.shop.dto.mapper;

import com.jewelry.shop.dto.ProductResponse;
import com.jewelry.shop.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product) {
        if (product == null) {
            return null;
        }

        ProductResponse response = new ProductResponse();
        response.setProductId(product.getProductId());
        response.setProductName(product.getProductName());
        response.setWeight(product.getWeight());
        response.setLaborCost(product.getLaborCost());
        response.setPurchasePrice(product.getPurchasePrice());
        response.setStockQuantity(product.getStockQuantity());
        response.setStatus(product.getStatus());

        if (product.getCategory() != null) {
            response.setCategoryId(product.getCategory().getCategoryId());
            response.setCategoryName(product.getCategory().getCategoryName());
        }

        if (product.getSupplier() != null) {
            response.setSupplierId(product.getSupplier().getSupplierId());
            response.setSupplierName(product.getSupplier().getSupplierName());
        }

        return response;
    }
}
