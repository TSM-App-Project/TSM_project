package com.jewelry.shop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class JewelryShopServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(JewelryShopServerApplication.class, args);
    }
}
