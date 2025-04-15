package com.example.backend.controller;

import com.example.backend.dto.InputRequest;
import com.example.backend.dto.AiResponse;
import com.example.backend.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*") // allow frontend connection
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/send")
    public AiResponse handleInput(@RequestBody InputRequest request) {
        return aiService.processUserInput(request);
    }
}
