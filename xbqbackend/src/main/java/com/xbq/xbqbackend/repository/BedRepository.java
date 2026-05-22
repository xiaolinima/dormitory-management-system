package com.xbq.xbqbackend.repository;

import com.xbq.xbqbackend.entity.Bed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BedRepository extends JpaRepository<Bed, Long> {

    List<Bed> findByRoomId(Long roomId);

    List<Bed> findByStatus(String status);

    Optional<Bed> findByRoomIdAndBedNumber(Long roomId, String bedNumber);

    @Query("SELECT b FROM Bed b WHERE b.status = 'AVAILABLE' AND b.room.gender = :gender AND b.room.status = 'AVAILABLE' AND b.room.currentCount < b.room.capacity")
    List<Bed> findAvailableBedsByGender(@Param("gender") String gender);

    @Query("SELECT b FROM Bed b WHERE b.student.id = :studentId AND b.status = 'OCCUPIED'")
    Optional<Bed> findOccupiedBedByStudentId(@Param("studentId") Long studentId);
}
