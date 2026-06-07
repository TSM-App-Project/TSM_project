package com.jewelry.shop.service;

import com.jewelry.shop.dto.ServiceRequest;
import com.jewelry.shop.repository.ServiceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class JewelryService {
    private final ServiceRepository serviceRepository;

    public JewelryService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public List<com.jewelry.shop.entity.Service> getAll() {
        return serviceRepository.findAll();
    }

    public com.jewelry.shop.entity.Service getById(Integer id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));
    }

    @Transactional
    public com.jewelry.shop.entity.Service create(ServiceRequest request) {
        com.jewelry.shop.entity.Service service = new com.jewelry.shop.entity.Service();
        service.setServiceName(request.getServiceName());
        service.setBasePrice(request.getBasePrice());
        service.setUnitName(request.getUnitName() == null ? "Lượt" : request.getUnitName());
        return serviceRepository.save(service);
    }

    @Transactional
    public com.jewelry.shop.entity.Service update(Integer id, ServiceRequest request) {
        com.jewelry.shop.entity.Service service = getById(id);
        if (request.getServiceName() != null) {
            service.setServiceName(request.getServiceName());
        }
        if (request.getBasePrice() != null) {
            service.setBasePrice(request.getBasePrice());
        }
        if (request.getUnitName() != null) {
            service.setUnitName(request.getUnitName());
        }
        return serviceRepository.save(service);
    }

    @Transactional
    public void delete(Integer id) {
        if (!serviceRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found");
        }
        serviceRepository.deleteById(id);
    }
}
