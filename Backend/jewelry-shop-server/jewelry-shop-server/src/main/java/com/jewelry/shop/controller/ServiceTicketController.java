package com.jewelry.shop.controller;

import com.jewelry.shop.dto.ServiceTicketRequest;
import com.jewelry.shop.entity.ServiceTicket;
import com.jewelry.shop.entity.ServiceTicketDetail;
import com.jewelry.shop.repository.ServiceTicketDetailRepository;
import com.jewelry.shop.repository.ServiceTicketRepository;
import com.jewelry.shop.service.ServiceTicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/service-tickets")
public class ServiceTicketController {
    private final ServiceTicketRepository serviceTicketRepository;
    private final ServiceTicketDetailRepository serviceTicketDetailRepository;
    private final ServiceTicketService serviceTicketService;

    public ServiceTicketController(ServiceTicketRepository serviceTicketRepository,
                                   ServiceTicketDetailRepository serviceTicketDetailRepository,
                                   ServiceTicketService serviceTicketService) {
        this.serviceTicketRepository = serviceTicketRepository;
        this.serviceTicketDetailRepository = serviceTicketDetailRepository;
        this.serviceTicketService = serviceTicketService;
    }

    @GetMapping
    public List<ServiceTicket> getAllTickets() {
        return serviceTicketRepository.findAll();
    }

    @GetMapping("/{id}")
    public ServiceTicket getTicketById(@PathVariable Integer id) {
        return serviceTicketRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));
    }

    @GetMapping("/{id}/details")
    public List<ServiceTicketDetail> getTicketDetails(@PathVariable Integer id) {
        return serviceTicketDetailRepository.findByServiceTicket_TicketId(id);
    }

    @GetMapping("/details")
    public List<ServiceTicketDetail> getAllTicketDetails() {
        return serviceTicketDetailRepository.findAll();
    }

    @PostMapping
    public ServiceTicket createTicket(@Valid @RequestBody ServiceTicketRequest request) {
        return serviceTicketService.create(request);
    }

    @PutMapping("/{id}")
    public ServiceTicket updateTicket(@PathVariable Integer id, @Valid @RequestBody ServiceTicketRequest request) {
        return serviceTicketService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable Integer id) {
        serviceTicketService.delete(id);
    }
}
