package com.xbq.xbqbackend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_application")
@Access(AccessType.PROPERTY)
public class Application {

    private Long id;
    private User student;
    private String gender;
    private String remark;
    private String status;
    private LocalDateTime applyTime;
    private LocalDateTime handleTime;
    private User handler;
    private String handleResult;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() { return id; }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    public User getStudent() { return student; }

    @Column(nullable = false, length = 10)
    public String getGender() { return gender; }

    @Column(columnDefinition = "TEXT")
    public String getRemark() { return remark; }

    @Column(nullable = false, length = 20)
    public String getStatus() { return status; }

    @Column(name = "apply_time")
    public LocalDateTime getApplyTime() { return applyTime; }

    @Column(name = "handle_time")
    public LocalDateTime getHandleTime() { return handleTime; }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "handler_id")
    public User getHandler() { return handler; }

    @Column(name = "handle_result", columnDefinition = "TEXT")
    public String getHandleResult() { return handleResult; }

    @Column(name = "created_at")
    public LocalDateTime getCreatedAt() { return createdAt; }

    @Column(name = "updated_at")
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        applyTime = LocalDateTime.now();
        if (status == null) status = "PENDING";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
