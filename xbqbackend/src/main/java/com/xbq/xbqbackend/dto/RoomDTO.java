package com.xbq.xbqbackend.dto;

import lombok.Data;

@Data
public class RoomDTO {
    private Long id;
    private Long floorId;
    private String floorName;
    private Long buildingId;
    private String buildingName;
    private String roomNumber;
    private Integer capacity;
    private Integer currentCount;
    private String gender;
    private String status;
    private String description;
}
