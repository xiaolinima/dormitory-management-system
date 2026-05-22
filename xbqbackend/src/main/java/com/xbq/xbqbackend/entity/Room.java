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
@Table(name = "tb_room")
@Access(AccessType.PROPERTY)
public class Room {

    private Long id;
    private Floor floor;
    private String roomNumber;
    private Integer capacity;
    private Integer currentCount;
    private String gender;
    private String status;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() { return id; }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "floor_id", nullable = false)
    public Floor getFloor() { return floor; }

    @Column(name = "room_number", nullable = false, length = 20)
    public String getRoomNumber() { return roomNumber; }

    @Column(nullable = false)
    public Integer getCapacity() { return capacity; }

    @Column(name = "current_count", nullable = false)
    public Integer getCurrentCount() { return currentCount; }

    @Column(nullable = false, length = 10)
    public String getGender() { return gender; }

    @Column(nullable = false, length = 20)
    public String getStatus() { return status; }

    @Column(columnDefinition = "TEXT")
    public String getDescription() { return description; }

    @Column(name = "created_at")
    public LocalDateTime getCreatedAt() { return createdAt; }

    @Column(name = "updated_at")
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (currentCount == null) currentCount = 0;
        if (status == null) status = "AVAILABLE";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
