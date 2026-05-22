package com.xbq.xbqbackend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class RepairDTO {
    private Long id;
    private Long roomId;
    private String roomNumber;
    private String buildingName;
    private Long studentId;
    private String studentName;

    @NotBlank(message = "申请类型不能为空")
    private String type;

    private String description;
    private String status;
    private String applyTime;
    private String handleTime;
    private Long handlerId;
    private String handlerName;
    private String handleResult;
}
