package com.jewelry.shop.repository;

import com.jewelry.shop.entity.ServiceTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceTicketRepository extends JpaRepository<ServiceTicket, Integer> {
}
