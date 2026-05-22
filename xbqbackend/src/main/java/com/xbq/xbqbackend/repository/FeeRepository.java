package com.xbq.xbqbackend.repository;

import com.xbq.xbqbackend.entity.Fee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeeRepository extends JpaRepository<Fee, Long> {

    List<Fee> findByStudentId(Long studentId);

    List<Fee> findByStatus(String status);

    List<Fee> findBySemester(String semester);

    @Query("SELECT f FROM Fee f WHERE f.status = 'UNPAID' OR f.status = 'OVERDUE'")
    List<Fee> findUnpaidFees();

    @Modifying
    @Query("UPDATE Fee f SET f.status = :status, f.paidTime = CURRENT_TIMESTAMP WHERE f.id = :feeId")
    int updateFeeStatus(@Param("feeId") Long feeId, @Param("status") String status);
}
