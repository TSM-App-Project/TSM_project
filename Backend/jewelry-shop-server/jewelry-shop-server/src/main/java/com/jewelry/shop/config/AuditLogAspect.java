package com.jewelry.shop.config;

import com.jewelry.shop.entity.AuditLog;
import com.jewelry.shop.entity.User;
import com.jewelry.shop.repository.AuditLogRepository;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditLogAspect {
    private final AuditLogRepository auditLogRepository;

    public AuditLogAspect(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    // ✅ SỬA CÚ PHÁP: Cộng chuỗi (String concatenation) để không bị lỗi compile do ngắt dòng
    @AfterReturning(pointcut = "execution(* com.jewelry.shop.service.*.create*(..)) || " +
            "execution(* com.jewelry.shop.service.*.update*(..)) || " +
            "execution(* com.jewelry.shop.service.*.delete*(..))")
    public void logAction(JoinPoint joinPoint) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String methodName = joinPoint.getSignature().getName();
        String className  = joinPoint.getTarget().getClass().getSimpleName();

        // Kiểm tra xem User có đăng nhập hợp lệ không và ép kiểu lấy đối tượng User
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof User) {

            // Lấy trực tiếp entity User đang thao tác (đã được lưu trong Context từ JWT Filter)
            User currentUser = (User) auth.getPrincipal();

            // Thay thế TODO: Tạo Entity và lưu xuống Database
            AuditLog log = AuditLog.builder()
                    .user(currentUser)
                    .actionType(methodName.toUpperCase())
                    .affectedTable(className.replace("Service", ""))
                    .description("Tự động ghi nhận thao tác: " + methodName)
                    .build();

            auditLogRepository.save(log);

            // Log ra console để bạn dễ theo dõi khi debug
            System.out.println("✅ Đã lưu AUDIT LOG: " + methodName.toUpperCase() +
                    " trên " + log.getAffectedTable() +
                    " bởi " + currentUser.getUsername());
        }
    }
}