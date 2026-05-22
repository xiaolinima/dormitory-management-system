package com.xbq.xbqbackend.dto;

import lombok.Data;

@Data
public class BuildingDTO {
    private Long id;
    private String name;
    private String address;
    private Integer totalFloors;
    private String description;
}
