import { spawn } from "child_process";
import { validateVerificationResult } from "./utils/schemas";
import path from "path";
import fs from "fs";

interface DocumentVerificationResult {
  isId: boolean;
  nameMatch: boolean;
  confidence: "high" | "low" | "none";
  type: string;
  error?: string;
  detectedText?: {
    words: Array<{
      text: string;
      confidence: number;
      position: {
        top_left: [number, number];
        top_right: [number, number];
        bottom_right: [number, number];
        bottom_left: [number, number];
      };
    }>;
    foundIdIndicators: string[];
    foundNameParts: string[];
    completeText: string;
  };
}

export async function verify_document(
  imagePath: string,
  fullName: string,
): Promise<DocumentVerificationResult> {
  return new Promise((resolve, reject) => {
    try {
      // Ensure the image path exists
      if (!fs.existsSync(imagePath)) {
        console.error(`Image file not found at path: ${imagePath}`);
        return resolve({
          isId: false,
          nameMatch: false,
          confidence: "none",
          type: "Free Membership",
          error: "Image file not found",
        });
      }

      console.log("Starting document verification process...", {
        imagePath,
        fullName,
        pythonPath: process.env.PYTHON_PATH || "python3.11",
        cwd: process.cwd(),
      });

      // Get the absolute path to the service.py script
      const scriptPath = path.resolve(process.cwd(), "server", "service.py");
      if (!fs.existsSync(scriptPath)) {
        console.error(`Python script not found at path: ${scriptPath}`);
        return resolve({
          isId: false,
          nameMatch: false,
          confidence: "none",
          type: "Free Membership",
          error: "Verification service unavailable",
        });
      }

      // Use Python 3.11 explicitly and pass environment variables
      const pythonProcess = spawn(
        process.env.PYTHON_PATH || "python3.11",
        [scriptPath, "verify_document", imagePath, fullName],
        {
          env: {
            ...process.env,
            PYTHONUNBUFFERED: "1",
            PYTHONPATH: process.env.PYTHONPATH || process.cwd(),
          },
          stdio: ["pipe", "pipe", "pipe"],
        },
      );

      let stdout = "";
      let stderr = "";

      pythonProcess.stdout.on("data", (data) => {
        const output = data.toString();
        stdout += output;
        console.log("Python process stdout:", output);
      });

      pythonProcess.stderr.on("data", (data) => {
        const error = data.toString();
        stderr += error;
        console.error("Python process stderr:", error);
      });

      pythonProcess.on("error", (error) => {
        console.error("Failed to start Python process:", error);
        resolve({
          isId: false,
          nameMatch: false,
          confidence: "none",
          type: "Free Membership",
          error: `Failed to start verification process: ${error.message}`,
        });
      });

      // Set a timeout to kill the process if it takes too long
      const timeout = setTimeout(() => {
        pythonProcess.kill();
        console.error("Python process timed out");
        resolve({
          isId: false,
          nameMatch: false,
          confidence: "none",
          type: "Free Membership",
          error: "Document verification timed out",
        });
      }, 105000); // 105 second timeout (increased from 30s)

      pythonProcess.on("close", (code) => {
        clearTimeout(timeout);
        console.log("Python process closed with code:", code);
        console.log("Final stdout:", stdout);
        console.log("Final stderr:", stderr);

        if (code === 0 && stdout.trim()) {
          try {
            const result = JSON.parse(stdout.trim());
            const validationResult = validateVerificationResult(result);

            if (!validationResult.valid) {
              console.error("Validation errors:", validationResult.errors);
              resolve({
                isId: false,
                nameMatch: false,
                confidence: "none",
                type: "Free Membership",
                error: "Invalid document verification result format",
              });
              return;
            }

            resolve(result);
          } catch (error) {
            console.error("Error parsing Python output:", error);
            resolve({
              isId: false,
              nameMatch: false,
              confidence: "none",
              type: "Free Membership",
              error: "Failed to parse verification result",
            });
          }
        } else {
          console.error(`Python process failed with code ${code}`);
          console.error("Final stderr:", stderr);
          resolve({
            isId: false,
            nameMatch: false,
            confidence: "none",
            type: "Free Membership",
            error: stderr || "Document verification failed",
          });
        }
      });
    } catch (error) {
      console.error("Unexpected error in verify_document:", error);
      resolve({
        isId: false,
        nameMatch: false,
        confidence: "none",
        type: "Free Membership",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  });
}
