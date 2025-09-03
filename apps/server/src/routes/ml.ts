/**
 * API Router for Homomorphic ML Inference
 * Handles encrypted mental health assessments with full privacy protection
 */

import { Hono } from "hono";
import { homomorphicMLProcessor } from "../ml/homomorphic-ml";
import { ApiResponse } from "../helpers/api-response";
import type { HonoEnv } from "../definitions/common.types";

const mlRouter = new Hono<HonoEnv>();

// Initialize the ML processor on first request
let isProcessorInitialized = false;

/**
 * Initialize homomorphic ML processor
 */
async function ensureProcessorInitialized() {
  if (!isProcessorInitialized) {
    await homomorphicMLProcessor.initialize();
    isProcessorInitialized = true;
  }
}

/**
 * Helper function to convert base64 to Uint8Array (Workers-compatible)
 */
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Helper function to convert Uint8Array to base64 (Workers-compatible)
 */
function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binaryString = '';
  for (let i = 0; i < bytes.length; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return btoa(binaryString);
}

/**
 * Process encrypted mental health assessment
 * POST /ml/assess-encrypted
 */
mlRouter.post("/assess-encrypted", async (c) => {
  try {
    await ensureProcessorInitialized();

    const body = await c.req.json();
    
    // Validate request structure
    if (!body.encryptedResponses || !body.publicKey) {
      return c.json(
        ApiResponse.badRequest("Missing required fields: encryptedResponses, publicKey"),
        400
      );
    }

    // Convert base64 encoded data back to Uint8Array using Workers-compatible methods
    const input = {
      encryptedResponses: body.encryptedResponses.map((response: string) => 
        base64ToUint8Array(response)
      ),
      encryptedMetadata: {
        timestamp: base64ToUint8Array(body.encryptedMetadata?.timestamp || ""),
        questionCount: base64ToUint8Array(body.encryptedMetadata?.questionCount || ""),
      },
      publicKey: base64ToUint8Array(body.publicKey),
    };

    // Process encrypted questionnaire through ML model
    const result = await homomorphicMLProcessor.processEncryptedQuestionnaire(input);

    // Convert result back to base64 for JSON transmission using Workers-compatible methods
    const response = {
      encryptedDepressionLevel: uint8ArrayToBase64(result.encryptedDepressionLevel),
      encryptedConfidenceScore: uint8ArrayToBase64(result.encryptedConfidenceScore),
      processedAt: new Date().toISOString(),
    };

    return c.json(
      ApiResponse.success(response, "Assessment processed successfully"),
      200
    );

  } catch (error) {
    console.error('Encrypted assessment processing error:', error);
    return c.json(
      ApiResponse.serverError("Failed to process encrypted assessment", 500, {
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      500
    );
  }
});

/**
 * Get model metadata (non-sensitive information)
 * GET /ml/model-info
 */
mlRouter.get("/model-info", async (c) => {
  try {
    const metadata = {
      version: "1.0.0",
      description: "Homomorphic depression screening model",
      questionsSupported: 9,
      responseScale: "1-5 (Never to Always)",
      outputLevels: ["No", "Low", "Mild", "High"],
      privacyFeatures: [
        "End-to-end homomorphic encryption",
        "No raw data exposure",
        "Client-side key generation",
        "Server-side encrypted processing"
      ],
      lastUpdated: new Date().toISOString(),
    };

    return c.json(
      ApiResponse.success(metadata, "Model information retrieved"),
      200
    );
  } catch (error) {
    console.error('Model info retrieval error:', error);
    return c.json(
      ApiResponse.serverError("Failed to retrieve model information"),
      500
    );
  }
});

/**
 * Health check for ML service
 * GET /ml/health
 */
mlRouter.get("/health", async (c) => {
  try {
    const health = {
      status: "healthy",
      mlProcessorInitialized: isProcessorInitialized,
      timestamp: new Date().toISOString(),
    };

    return c.json(
      ApiResponse.success(health, "ML service is healthy"),
      200
    );
  } catch (error) {
    return c.json(
      ApiResponse.serverError("ML service health check failed"),
      500
    );
  }
});

/**
 * Initialize ML processor endpoint (for manual initialization if needed)
 * POST /ml/initialize
 */
mlRouter.post("/initialize", async (c) => {
  try {
    if (!isProcessorInitialized) {
      await ensureProcessorInitialized();
    }

    return c.json(
      ApiResponse.success(
        { initialized: isProcessorInitialized },
        "ML processor initialized successfully"
      ),
      200
    );
  } catch (error) {
    console.error('ML processor initialization error:', error);
    return c.json(
      ApiResponse.serverError("Failed to initialize ML processor", 500, {
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      500
    );
  }
});

export { mlRouter };