package com.xbq.xbqbackend.controller;

import com.xbq.xbqbackend.common.Result;
import com.xbq.xbqbackend.entity.Bed;
import com.xbq.xbqbackend.service.BedService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/beds")
@RequiredArgsConstructor
public class BedController {

    private final BedService bedService;

    @PostMapping
    public Result<Bed> create(@RequestBody Map<String, Object> params) {
        Long roomId = Long.valueOf(params.get("roomId").toString());
        String bedNumber = params.get("bedNumber").toString();
        return Result.success(bedService.createBed(roomId, bedNumber));
    }

    @GetMapping
    public Result<List<Bed>> findAll() {
        return Result.success(bedService.findAll());
    }

    @GetMapping("/room/{roomId}")
    public Result<List<Bed>> findByRoomId(@PathVariable Long roomId) {
        return Result.success(bedService.findByRoomId(roomId));
    }

    @GetMapping("/available")
    public Result<List<Bed>> available(@RequestParam String gender) {
        return Result.success(bedService.findAvailableByGender(gender));
    }

    @PostMapping("/assign")
    public Result<Bed> assign(@RequestBody Map<String, Long> params) {
        return Result.success(bedService.assignBed(params.get("bedId"), params.get("studentId")));
    }

    @PostMapping("/vacate")
    public Result<Void> vacate(@RequestBody Map<String, Long> params) {
        bedService.vacateBed(params.get("bedId"));
        return Result.success();
    }
}
