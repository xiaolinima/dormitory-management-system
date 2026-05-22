package com.xbq.xbqbackend.dto;

import lombok.Data;

@Data
public class TransferDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long fromRoomId;
    private String fromRoomNumber;
    private String fromBuildingName;
    private Long toRoomId;
    private String toRoomNumber;
    private String toBuildingName;
    private String reason;
    private String status;
    private String applyTime;
    private String handleTime;
    private Long handlerId;
    private String handlerName;
}
