package com.example.p3.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.File;
import java.util.Map;

@Service
public class ScriptRunnerService {
    public void runPythonScript() {
        try {
            // Get the OS name
            String osName = System.getProperty("os.name").toLowerCase();

            // Specify the project root directory and scripts folder
            String projectRoot = System.getProperty("user.dir");
            String scriptsDir = projectRoot + File.separator + "src" + File.separator + "main" + File.separator + "resources" + File.separator + "scripts";

            // Determine the Python executable path based on the OS
            String pythonExecutable;
            if (osName.contains("win")) {
                pythonExecutable = scriptsDir + File.separator + "venv" + File.separator + "Scripts" + File.separator + "python.exe";
            } else if (osName.contains("mac") || osName.contains("nix") || osName.contains("nux")) {
                // For Mac/Linux, check for both 'python3' and 'python'
                File python3Path = new File(scriptsDir + File.separator + "venv" + File.separator + "bin" + File.separator + "python3");
                if (python3Path.exists()) {
                    pythonExecutable = python3Path.getAbsolutePath();
                } else {
                    pythonExecutable = scriptsDir + File.separator + "venv" + File.separator + "bin" + File.separator + "python";
                }
            } else {
                throw new UnsupportedOperationException("Unsupported operating system: " + osName);
            }

            // Ensure the Python executable exists
            File pythonFile = new File(pythonExecutable);
            if (!pythonFile.exists()) {
                throw new RuntimeException("Python executable not found at: " + pythonExecutable);
            }

            // Build the command
            ProcessBuilder pb = new ProcessBuilder(
                    pythonExecutable,
                    "BerthCoordinatesScript.py"
            );

            // Set the working directory to the scripts directory
            pb.directory(new File(scriptsDir));

            // Merge error stream with output stream
            pb.redirectErrorStream(true);

            // Optional: Set environment variables if needed
            Map<String, String> env = pb.environment();
            env.put("PYTHONUNBUFFERED", "1"); // To prevent output buffering

            // Start the process
            Process process = pb.start();

            // Read the output
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }

            // Wait for the process to finish and get the exit code
            int exitCode = process.waitFor();
            System.out.println("Python script executed with exit code: " + exitCode);

        } catch (Exception e) {
            e.printStackTrace();
            // Handle exceptions appropriately, such as logging errors
        }
    }
}
