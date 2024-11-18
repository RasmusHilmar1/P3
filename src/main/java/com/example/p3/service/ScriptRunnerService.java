package com.example.p3.service;


import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;

@Service
public class ScriptRunnerService {
    public void runPythonScript() {
        try {
            // Create a ProcessBuilder object to run the command
            ProcessBuilder pb = new ProcessBuilder("python", "src/main/resources/Scripts/BerthCoordinatesScript.py");

            // Merge error stream with output stream
            pb.redirectErrorStream(true);

            // Start the process
            Process process = pb.start();

            // Wait for the process to finish and get the exit code
            int exitCode = process.waitFor();
            System.out.println("Python script executed with exit code: " + exitCode);

        } catch (Exception e) {
            e.printStackTrace();
            // Handle exceptions appropriately, such as logging errors
        }
    }
}
