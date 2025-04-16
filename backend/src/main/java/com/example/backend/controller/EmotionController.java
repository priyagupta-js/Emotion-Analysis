package com.example.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.io.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class EmotionController {

    @PostMapping("/analyze")
    public EmotionResponse analyzeEmotion(@RequestBody InputText input) {
        String text = input.getText();
        String emotion = "Unknown";
        double confidence = 0.0;

        try {
            System.out.println("Current working directory: " + new File(".").getAbsolutePath());

            // Run the Python script with input
            // ProcessBuilder pb = new ProcessBuilder("python", "../ml-models/predict_emotion.py", text);
            ProcessBuilder pb = new ProcessBuilder("python", "predict_emotion.py", text);
            pb.directory(new File("../ml-models")); // Set working directory here
            pb.redirectErrorStream(true);
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("PYTHON OUTPUT >>> " + line); // Debug print
            
                // Skip irrelevant lines
                if (!line.contains(",")) continue;
            
                String[] parts = line.split(",");
                if (parts.length == 2) {
                    try {
                        emotion = parts[0].trim();
                        confidence = Double.parseDouble(parts[1].trim());
                    } catch (NumberFormatException nfe) {
                        System.out.println("Skipping invalid prediction line: " + line);
                    }
                }
            }

            process.waitFor();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new EmotionResponse(emotion, confidence);
    }
}
