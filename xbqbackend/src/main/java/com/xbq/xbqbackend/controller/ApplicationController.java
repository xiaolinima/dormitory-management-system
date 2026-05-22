package com.xbq.xbqbackend.controller;

import com.xbq.xbqbackend.common.Result;
import com.xbq.xbqbackend.dto.ApplicationDTO;
import com.xbq.xbqbackend.entity.Application;
import com.xbq.xbqbackend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public Result<Application> apply(@RequestBody ApplicationDTO dto, @RequestParam Long studentId) {
        return Result.success(applicationService.apply(dto, studentId));
    }

    @GetMapping
    public Result<List<Application>> findAll() {
        return Result.success(applicationService.findAll());
    }

    @GetMapping("/student/{studentId}")
    public Result<List<Application>> findByStudentId(@PathVariable Long studentId) {
        return Result.success(applicationService.findByStudentId(studentId));
    }

    @PostMapping("/approve")
    public Result<Application> approve(@RequestBody Map<String, Object> params) {
        Long id = Long.valueOf(params.get("id").toString());
        String result = params.get("result") != null ? params.get("result").toString() : "已批准";
        Long handlerId = Long.valueOf(params.get("handlerId").toString());
        return Result.success(applicationService.approve(id, result, handlerId));
    }

    @PostMapping("/reject")
    public Result<Application> reject(@RequestBody Map<String, Object> params) {
        Long id = Long.valueOf(params.get("id").toString());
        String reason = params.get("reason") != null ? params.get("reason").toString() : "已拒绝";
        Long handlerId = Long.valueOf(params.get("handlerId").toString());
        return Result.success(applicationService.reject(id, reason, handlerId));
    }

    @DeleteMapping("/{id}")
    public Result<Void> cancel(@PathVariable Long id, @RequestParam Long studentId) {
        applicationService.cancel(id, studentId);
        return Result.success();
    }
}
