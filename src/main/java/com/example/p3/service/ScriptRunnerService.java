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
            // Specify the path to the Python executable in the virtual environment
            String projectRoot = System.getProperty("user.dir");
            String scriptsDir = projectRoot + File.separator + "src" + File.separator + "main" + File.separator + "resources" + File.separator + "scripts";
            String pythonExecutable = scriptsDir + File.separator + "venv" + File.separator + "Scripts" + File.separator + "python.exe";

            // Build the command
            ProcessBuilder pb = new ProcessBuilder(
                    pythonExecutable,
                    "BerthCoordinatesScript.py"
            );

            // Set the working directory to the Scripts directory
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
