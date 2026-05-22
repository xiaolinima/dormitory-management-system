package com.xbq.xbqbackend.repository;

import com.xbq.xbqbackend.entity.Repair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepairRepository extends JpaRepository<Repair, Long> {

    List<Repair> findByStudentId(Long studentId);

    List<Repair> findByRoomId(Long roomId);

    List<Repair> findByStatus(String status);

    List<Repair> findByType(String type);
}
