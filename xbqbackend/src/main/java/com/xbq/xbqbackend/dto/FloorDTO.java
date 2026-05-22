package com.xbq.xbqbackend.dto;

import lombok.Data;

@Data
public class FloorDTO {
    private Long id;
    private Long buildingId;
    private String buildingName;
    private Integer floorNumber;
    private String description;
}
