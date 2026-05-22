package com.xbq.xbqbackend.repository;

import com.xbq.xbqbackend.entity.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransferRepository extends JpaRepository<Transfer, Long> {

    List<Transfer> findByStudentId(Long studentId);

    List<Transfer> findByStatus(String status);
}
