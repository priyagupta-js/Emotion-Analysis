package com.example.backend.dto;

import lombok.Data;

@Data
public class InputRequest {
    private String text;         // Or audio input name/url
    private String inputType;    // "text" or "audio"
}
