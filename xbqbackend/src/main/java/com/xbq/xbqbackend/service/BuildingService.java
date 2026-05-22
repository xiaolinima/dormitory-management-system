package com.xbq.xbqbackend.service;

import com.xbq.xbqbackend.dto.BuildingDTO;
import com.xbq.xbqbackend.entity.Building;
import com.xbq.xbqbackend.exception.BusinessException;
import com.xbq.xbqbackend.repository.BuildingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BuildingService {

    private final BuildingRepository buildingRepository;

    public Building create(BuildingDTO dto) {
        Building building = new Building();
        building.setName(dto.getName());
        building.setAddress(dto.getAddress());
        building.setTotalFloors(dto.getTotalFloors());
        building.setDescription(dto.getDescription());
        return buildingRepository.save(building);
    }

    public List<Building> findAll() {
        return buildingRepository.findAll();
    }

    public Building findById(Long id) {
        return buildingRepository.findById(id)
                .orElseThrow(() -> new BusinessException("楼栋不存在"));
    }

    public Building update(Long id, BuildingDTO dto) {
        Building building = findById(id);
        building.setName(dto.getName());
        building.setAddress(dto.getAddress());
        building.setTotalFloors(dto.getTotalFloors());
        building.setDescription(dto.getDescription());
        return buildingRepository.save(building);
    }

    public void delete(Long id) {
        buildingRepository.deleteById(id);
    }
}
