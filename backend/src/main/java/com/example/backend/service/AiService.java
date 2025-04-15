package com.example.backend.service;

import com.example.backend.dto.InputRequest;
import com.example.backend.dto.AiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AiService {

    @Value("${ml.api.url}")
    private String mlApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public AiResponse processUserInput(InputRequest input) {
        return restTemplate.postForObject(mlApiUrl, input, AiResponse.class);
    }
}
