package com.example.backend.controller;
public class EmotionResponse {
    private String emotion;
    private double confidence;

    public EmotionResponse(String emotion, double confidence) {
        this.emotion = emotion;
        this.confidence = confidence;
    }

    public String getEmotion() {
        return emotion;
    }

    public double getConfidence() {
        return confidence;
    }
}
