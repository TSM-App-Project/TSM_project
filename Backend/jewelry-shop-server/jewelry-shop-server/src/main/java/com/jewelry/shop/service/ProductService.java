package com.jewelry.shop.service;

import com.jewelry.shop.dto.ProductRequest;
import com.jewelry.shop.entity.Product;

public interface ProductService {
    Product create(ProductRequest request);
    Product update(Integer id, ProductRequest request);
    void delete(Integer id);
}
