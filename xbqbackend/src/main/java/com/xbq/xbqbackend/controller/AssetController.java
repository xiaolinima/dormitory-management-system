package com.xbq.xbqbackend.controller;

import com.xbq.xbqbackend.common.Result;
import com.xbq.xbqbackend.dto.AssetDTO;
import com.xbq.xbqbackend.entity.Asset;
import com.xbq.xbqbackend.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @PostMapping
    public Result<Asset> create(@RequestBody AssetDTO dto) {
        return Result.success(assetService.create(dto));
    }

    @GetMapping
    public Result<List<Asset>> findAll() {
        return Result.success(assetService.findAll());
    }

    @GetMapping("/room/{roomId}")
    public Result<List<Asset>> findByRoomId(@PathVariable Long roomId) {
        return Result.success(assetService.findByRoomId(roomId));
    }

    @PutMapping("/{id}")
    public Result<Asset> update(@PathVariable Long id, @RequestBody AssetDTO dto) {
        return Result.success(assetService.update(id, dto));
    }

    @PostMapping("/check/{id}")
    public Result<Asset> check(@PathVariable Long id) {
        return Result.success(assetService.check(id));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        assetService.delete(id);
        return Result.success();
    }
}
