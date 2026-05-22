package com.xbq.xbqbackend.service;

import com.xbq.xbqbackend.dto.AssetDTO;
import com.xbq.xbqbackend.entity.Asset;
import com.xbq.xbqbackend.entity.Room;
import com.xbq.xbqbackend.exception.BusinessException;
import com.xbq.xbqbackend.repository.AssetRepository;
import com.xbq.xbqbackend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;
    private final RoomRepository roomRepository;

    public Asset create(AssetDTO dto) {
        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new BusinessException("房间不存在"));

        Asset asset = new Asset();
        asset.setRoom(room);
        asset.setName(dto.getName());
        asset.setQuantity(dto.getQuantity());
        asset.setConditionStatus(dto.getConditionStatus() != null ? dto.getConditionStatus() : "GOOD");
        asset.setDescription(dto.getDescription());
        return assetRepository.save(asset);
    }

    public List<Asset> findAll() {
        return assetRepository.findAll();
    }

    public List<Asset> findByRoomId(Long roomId) {
        return assetRepository.findByRoomId(roomId);
    }

    public Asset update(Long id, AssetDTO dto) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new BusinessException("资产不存在"));
        asset.setName(dto.getName());
        asset.setQuantity(dto.getQuantity());
        asset.setConditionStatus(dto.getConditionStatus());
        asset.setDescription(dto.getDescription());
        return assetRepository.save(asset);
    }

    public Asset check(Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new BusinessException("资产不存在"));
        asset.setLastCheckTime(LocalDateTime.now());
        return assetRepository.save(asset);
    }

    public void delete(Long id) {
        assetRepository.deleteById(id);
    }
}
