package com.jewelry.shop.config;

import com.jewelry.shop.entity.AuditLog;
import com.jewelry.shop.repository.AuditLogRepository;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditLogAspect {

    private final AuditLogRepository auditLogRepository;

    public AuditLogAspect(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    // Bắt tất cả các hàm có tên bắt đầu bằng "create", "update", "delete" trong package service
    @AfterReturning(pointcut = "execution(* com.jewelry.shop.service.*.create*(..)) || " +
            "execution(* com.jewelry.shop.service.*.update*(..)) || " +
            "execution(* com.jewelry.shop.service.*.delete*(..))")
    public void logAction(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();

        AuditLog log = new AuditLog();
        log.setActionType(methodName.toUpperCase());
        log.setAffectedTable(className.replace("Service", ""));
        log.setDescription("Hệ thống tự động ghi nhận thao tác: " + methodName);
        // Tạm thời gán User ID cố định hoặc lấy từ SecurityContextHolder (nếu đã cài JWT)
        // auditLogRepository.save(log);
    }
}