package com.xbq.xbqbackend.repository;

import com.xbq.xbqbackend.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {

    List<Asset> findByRoomId(Long roomId);

    List<Asset> findByConditionStatus(String conditionStatus);
}
