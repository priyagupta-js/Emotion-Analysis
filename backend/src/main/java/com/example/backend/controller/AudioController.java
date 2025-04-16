// Emotion-Analysis/backend/src/main/com/example/backend/controller/AudioController.java
package com.example.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.nio.file.Files;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class AudioController {

    @PostMapping("/audio")
    public ResponseEntity<byte[]> handleAudioUpload(@RequestParam("file") MultipartFile file) throws IOException {
        File tempInputFile = File.createTempFile("input", ".wav");
        file.transferTo(tempInputFile);
        System.out.println("Temp input file size: " + tempInputFile.length() + " bytes");

        System.out.println("Current working directory: " + new File(".").getAbsolutePath());

        ProcessBuilder pb = new ProcessBuilder("python", "predict.py", tempInputFile.getAbsolutePath());
        pb.directory(new File("../ml-models"));
        System.out.println("Working directory: " + pb.directory().getAbsolutePath());
        pb.redirectErrorStream(true);
        Process process = pb.start();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        InputStream is = process.getInputStream();
        byte[] buffer = new byte[1024];
        int length;
        while ((length = is.read(buffer)) != -1) {
            System.out.write(buffer, 0, length); // log to backend console
            outputStream.write(buffer, 0, length);
        }

        int exitCode;
        try {
            exitCode = process.waitFor();
            if (exitCode != 0) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                    .body(("Python script failed with code: " + exitCode).getBytes());
            }
        } catch (InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        File outputAudio = new File(pb.directory().getAbsolutePath() + File.separator + "output.wav");
        System.out.println("Looking for output.wav at: " + outputAudio.getAbsolutePath());
        if (!outputAudio.exists()) {
            tempInputFile.delete(); // Clean up
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Error: output.wav not found. Python script may have failed.".getBytes());
        }
        System.out.println("Output file exists: " + outputAudio.getAbsolutePath() + " -> " + outputAudio.exists());
        byte[] audioBytes = Files.readAllBytes(outputAudio.toPath());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(audioBytes);
    }
}