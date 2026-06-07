package com.jewelry.shop.repository;

import com.jewelry.shop.entity.ServiceTicketDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceTicketDetailRepository extends JpaRepository<ServiceTicketDetail, Integer> {
	List<ServiceTicketDetail> findByServiceTicket_TicketId(Integer ticketId);
}
