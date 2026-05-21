package com.jewelry.shop.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer logId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "log_time")
    private LocalDateTime logTime = LocalDateTime.now();

    @Column(name = "action_type", nullable = false, length = 50)
    private String actionType;

    @Column(name = "affected_table", nullable = false, length = 100)
    private String affectedTable;

    @Column(columnDefinition = "text")
    private String description;
}