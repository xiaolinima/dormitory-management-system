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
@Table(name = "tb_asset")
@Access(AccessType.PROPERTY)
public class Asset {

    private Long id;
    private Room room;
    private String name;
    private Integer quantity;
    private String conditionStatus;
    private LocalDateTime lastCheckTime;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id", nullable = false)
    public Room getRoom() {
        return room;
    }

    @Column(nullable = false, length = 100)
    public String getName() {
        return name;
    }

    @Column(nullable = false)
    public Integer getQuantity() {
        return quantity;
    }

    @Column(name = "condition_status", nullable = false, length = 20)
    public String getConditionStatus() {
        return conditionStatus;
    }

    @Column(name = "last_check_time")
    public LocalDateTime getLastCheckTime() {
        return lastCheckTime;
    }

    @Column(columnDefinition = "TEXT")
    public String getDescription() {
        return description;
    }

    @Column(name = "created_at")
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @Column(name = "updated_at")
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (quantity == null) quantity = 1;
        if (conditionStatus == null) conditionStatus = "GOOD";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
