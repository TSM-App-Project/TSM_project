package com.jewelry.shop.controller;

import com.jewelry.shop.dto.ServiceRequest;
import com.jewelry.shop.entity.Service;
import com.jewelry.shop.repository.ServiceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {
    private final ServiceRepository serviceRepository;

    public ServiceController(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @GetMapping
    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }

    @GetMapping("/{id}")
    public Service getServiceById(@PathVariable Integer id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));
    }

    @PostMapping
    public Service createService(@RequestBody ServiceRequest request) {
        Service service = new Service();
        service.setServiceName(request.getServiceName());
        service.setBasePrice(request.getBasePrice());
        service.setStatus(request.getStatus() == null ? "ACTIVE" : request.getStatus());
        return serviceRepository.save(service);
    }

    @PutMapping("/{id}")
    public Service updateService(@PathVariable Integer id, @RequestBody ServiceRequest request) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

        if (request.getServiceName() != null) {
            service.setServiceName(request.getServiceName());
        }
        if (request.getBasePrice() != null) {
            service.setBasePrice(request.getBasePrice());
        }
        if (request.getStatus() != null) {
            service.setStatus(request.getStatus());
        }
        return serviceRepository.save(service);
    }

    @DeleteMapping("/{id}")
    public void deleteService(@PathVariable Integer id) {
        if (!serviceRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found");
        }
        serviceRepository.deleteById(id);
    }
}
