package com.xbq.xbqbackend.service;

import com.xbq.xbqbackend.dto.FloorDTO;
import com.xbq.xbqbackend.entity.Building;
import com.xbq.xbqbackend.entity.Floor;
import com.xbq.xbqbackend.exception.BusinessException;
import com.xbq.xbqbackend.repository.BuildingRepository;
import com.xbq.xbqbackend.repository.FloorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FloorService {

    private final FloorRepository floorRepository;
    private final BuildingRepository buildingRepository;

    private FloorDTO convertToDTO(Floor floor) {
        FloorDTO dto = new FloorDTO();
        dto.setId(floor.getId());
        dto.setBuildingId(floor.getBuilding().getId());
        dto.setBuildingName(floor.getBuilding().getName());
        dto.setFloorNumber(floor.getFloorNumber());
        dto.setDescription(floor.getDescription());
        return dto;
    }

    public FloorDTO create(FloorDTO dto) {
        Building building = buildingRepository.findById(dto.getBuildingId())
                .orElseThrow(() -> new BusinessException("楼栋不存在"));

        if (dto.getFloorNumber() < 1 || dto.getFloorNumber() > building.getTotalFloors()) {
            throw new BusinessException("楼层号超出楼栋总楼层范围");
        }

        if (floorRepository.findByBuildingIdAndFloorNumber(dto.getBuildingId(), dto.getFloorNumber()).isPresent()) {
            throw new BusinessException("该楼层已存在");
        }

        Floor floor = new Floor();
        floor.setBuilding(building);
        floor.setFloorNumber(dto.getFloorNumber());
        floor.setDescription(dto.getDescription());
        Floor saved = floorRepository.save(floor);
        return convertToDTO(saved);
    }

    public List<Floor> findAll() {
        return floorRepository.findAll();
    }

    public List<FloorDTO> findAllDTOs() {
        return floorRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<Floor> findByBuildingId(Long buildingId) {
        return floorRepository.findByBuildingId(buildingId);
    }

    public List<FloorDTO> findByBuildingIdDTOs(Long buildingId) {
        return floorRepository.findByBuildingId(buildingId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Floor findById(Long id) {
        return floorRepository.findById(id)
                .orElseThrow(() -> new BusinessException("楼层不存在"));
    }

    public FloorDTO findByIdDTO(Long id) {
        Floor floor = findById(id);
        return convertToDTO(floor);
    }

    public FloorDTO update(Long id, FloorDTO dto) {
        Floor floor = findById(id);
        floor.setFloorNumber(dto.getFloorNumber());
        floor.setDescription(dto.getDescription());
        Floor saved = floorRepository.save(floor);
        return convertToDTO(saved);
    }

    public void delete(Long id) {
        floorRepository.deleteById(id);
    }
}
