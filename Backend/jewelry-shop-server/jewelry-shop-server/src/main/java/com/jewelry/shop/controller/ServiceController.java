package com.jewelry.shop.controller;

import com.jewelry.shop.dto.ServiceRequest;
import com.jewelry.shop.service.JewelryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin("*")
public class ServiceController {

    private final JewelryService jewelryService;

    public ServiceController(JewelryService jewelryService) {
        this.jewelryService = jewelryService;
    }

    @GetMapping
    public List<com.jewelry.shop.entity.Service> getAllServices() {
        return jewelryService.getAll();
    }

    @GetMapping("/{id}")
    public com.jewelry.shop.entity.Service getServiceById(@PathVariable Integer id) {
        return jewelryService.getById(id);
    }

    @PostMapping
    public com.jewelry.shop.entity.Service createService(@Valid @RequestBody ServiceRequest request) {
        return jewelryService.create(request);
    }

    @PutMapping("/{id}")
    public com.jewelry.shop.entity.Service updateService(@PathVariable Integer id, @Valid @RequestBody ServiceRequest request) {
        return jewelryService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteService(@PathVariable Integer id) {
        jewelryService.delete(id);
    }
}