package com.xbq.xbqbackend.repository;

import com.xbq.xbqbackend.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByFloorId(Long floorId);

    List<Room> findByGender(String gender);

    List<Room> findByStatus(String status);

    Optional<Room> findByFloorIdAndRoomNumber(Long floorId, String roomNumber);

    @Query("SELECT r FROM Room r WHERE r.gender = :gender AND r.status = 'AVAILABLE' AND r.currentCount < r.capacity")
    List<Room> findAvailableRoomsByGender(@Param("gender") String gender);

    @Modifying
    @Query("UPDATE Room r SET r.currentCount = r.currentCount + 1 WHERE r.id = :roomId AND r.currentCount < r.capacity")
    int incrementCurrentCount(@Param("roomId") Long roomId);

    @Modifying
    @Query("UPDATE Room r SET r.currentCount = r.currentCount - 1 WHERE r.id = :roomId AND r.currentCount > 0")
    int decrementCurrentCount(@Param("roomId") Long roomId);
}
