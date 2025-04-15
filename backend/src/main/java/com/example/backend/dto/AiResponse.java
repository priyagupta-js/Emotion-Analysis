package com.example.backend.dto;

import lombok.Data;

@Data
public class AiResponse {
    private String emotion;
    private String replyText;
    private String replyAudioUrl; // optional if audio used
}
