package com.xbq.xbqbackend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_fee")
@Access(AccessType.PROPERTY)
public class Fee {

    private Long id;
    private User student;
    private String semester;
    private BigDecimal amount;
    private String status;
    private LocalDate dueDate;
    private LocalDateTime paidTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() { return id; }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    public User getStudent() { return student; }

    @Column(nullable = false, length = 20)
    public String getSemester() { return semester; }

    @Column(nullable = false, precision = 10, scale = 2)
    public BigDecimal getAmount() { return amount; }

    @Column(nullable = false, length = 20)
    public String getStatus() { return status; }

    @Column(name = "due_date")
    public LocalDate getDueDate() { return dueDate; }

    @Column(name = "paid_time")
    public LocalDateTime getPaidTime() { return paidTime; }

    @Column(name = "created_at")
    public LocalDateTime getCreatedAt() { return createdAt; }

    @Column(name = "updated_at")
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = "UNPAID";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
