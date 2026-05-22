package com.xbq.xbqbackend.repository;

import com.xbq.xbqbackend.entity.Floor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FloorRepository extends JpaRepository<Floor, Long> {

    List<Floor> findByBuildingId(Long buildingId);

    Optional<Floor> findByBuildingIdAndFloorNumber(Long buildingId, Integer floorNumber);
}
