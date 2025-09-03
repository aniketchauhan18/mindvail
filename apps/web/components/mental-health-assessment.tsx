/**
 * Mental Health Assessment Component with Homomorphic Encryption
 * Provides a secure questionnaire interface that encrypts responses client-side
 */

'use client';

import React, { useState, useEffect } from 'react';
import { homomorphicClient } from '@/lib/homomorphic-encryption';
import { Button } from '@workspace/ui/components/button';
import { Loader2, Shield, Lock, Eye } from 'lucide-react';

interface QuestionnaireQuestion {
  id: number;
  text: string;
  description?: string;
}

const ASSESSMENT_QUESTIONS: QuestionnaireQuestion[] = [
  {
    id: 1,
    text: "Little interest or pleasure in doing things",
    description: "Over the last 2 weeks, how often have you been bothered by this?"
  },
  {
    id: 2,
    text: "Feeling down, depressed, or hopeless",
    description: "Over the last 2 weeks, how often have you been bothered by this?"
  },
  {
    id: 3,
    text: "Trouble falling or staying asleep, or sleeping too much",
    description: "Over the last 2 weeks, how often have you been bothered by this?"
  },
  {
    id: 4,
    text: "Feeling tired or having little energy",
    description: "Over the last 2 weeks, how often have you been bothered by this?"
  },
  {
    id: 5,
    text: "Poor appetite or overeating",
    description: "Over the last 2 weeks, how often have you been bothered by this?"
  },
  {
    id: 6,
    text: "Feeling bad about yourself or that you are a failure",
    description: "Over the last 2 weeks, how often have you been bothered by this?"
  },
  {
    id: 7,
    text: "Trouble concentrating on things, such as reading or watching TV",
    description: "Over the last 2 weeks, how often have you been bothered by this?"
  },
  {
    id: 8,
    text: "Moving or speaking slowly, or being fidgety or restless",
    description: "Over the last 2 weeks, how often have you been bothered by this?"
  },
  {
    id: 9,
    text: "Thoughts that you would be better off dead or hurting yourself",
    description: "Over the last 2 weeks, how often have you been bothered by this?"
  },
];

const RESPONSE_OPTIONS = [
  { value: 1, label: "Not at all" },
  { value: 2, label: "Several days" },
  { value: 3, label: "More than half the days" },
  { value: 4, label: "Nearly every day" },
  { value: 5, label: "Every day" },
];

interface AssessmentResult {
  depressionLevel: string;
  confidenceScore: number;
}

export default function MentalHealthAssessment() {
  const [currentStep, setCurrentStep] = useState(0); // 0: intro, 1-9: questions, 10: processing, 11: results
  const [responses, setResponses] = useState<{ [key: number]: number }>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [encryptionInitialized, setEncryptionInitialized] = useState(false);
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);

  useEffect(() => {
    initializeEncryption();
  }, []);

  const initializeEncryption = async () => {
    try {
      // Try to load existing keys or generate new ones
      const keysLoaded = homomorphicClient.loadKeysFromStorage();
      
      if (!keysLoaded) {
        await homomorphicClient.initialize();
        homomorphicClient.storeKeysSecurely();
      }
      
      setEncryptionInitialized(true);
    } catch (error) {
      console.error('Failed to initialize encryption:', error);
      setError('Failed to initialize secure encryption. Please refresh and try again.');
    }
  };

  const handleResponseChange = (questionId: number, value: number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const goToNextStep = () => {
    if (currentStep < ASSESSMENT_QUESTIONS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitAssessment = async () => {
    if (!encryptionInitialized) {
      setError('Encryption not initialized. Please refresh and try again.');
      return;
    }

    setIsProcessing(true);
    setCurrentStep(10); // Processing step
    setError(null);

    try {
      // Convert responses to array format expected by the model
      const responseArray = ASSESSMENT_QUESTIONS.map(q => responses[q.id] || 1);
      
      // Encrypt the responses
      const encryptedData = await homomorphicClient.encryptQuestionnaire(
        responseArray,
        { timestamp: Date.now(), questionCount: responseArray.length }
      );

      // Prepare data for API
      const apiData = {
        encryptedResponses: encryptedData.encryptedResponses.map(response => 
          Buffer.from(response).toString('base64')
        ),
        encryptedMetadata: {
          timestamp: Buffer.from(encryptedData.encryptedMetadata.timestamp).toString('base64'),
          questionCount: Buffer.from(encryptedData.encryptedMetadata.questionCount).toString('base64'),
        },
        publicKey: Buffer.from(homomorphicClient.getPublicKey()).toString('base64'),
      };

      // Send to server for processing
      const response = await fetch('/api/ml/assess-encrypted', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error('Failed to process assessment');
      }

      const serverResponse = await response.json();
      
      if (!serverResponse.success) {
        throw new Error(serverResponse.message || 'Assessment processing failed');
      }

      // Decrypt the result
      const encryptedPrediction = {
        encryptedDepressionLevel: new Uint8Array(Buffer.from(serverResponse.data.encryptedDepressionLevel, 'base64')),
        encryptedConfidenceScore: new Uint8Array(Buffer.from(serverResponse.data.encryptedConfidenceScore, 'base64')),
      };

      const decryptedResult = await homomorphicClient.decryptPrediction(encryptedPrediction);
      
      setResult(decryptedResult);
      setCurrentStep(11); // Results step
      
    } catch (error) {
      console.error('Assessment processing error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during assessment');
      setCurrentStep(ASSESSMENT_QUESTIONS.length); // Go back to last question
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAssessment = () => {
    setCurrentStep(0);
    setResponses({});
    setResult(null);
    setError(null);
  };

  const renderIntroStep = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-lg border p-6 shadow-lg">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-6 w-6 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Secure Mental Health Assessment</h1>
        </div>
        <p className="text-gray-600">A confidential questionnaire to help understand your mental wellbeing</p>
      </div>

      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-800">Your Privacy is Protected</span>
          </div>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• All responses are encrypted on your device before sending</li>
            <li>• Our AI processes encrypted data without seeing your actual answers</li>
            <li>• Only you can decrypt and view the results</li>
            <li>• No personal data is stored or shared</li>
          </ul>
          <button
            className="mt-2 p-0 text-green-600 underline text-sm flex items-center gap-1"
            onClick={() => setShowPrivacyDetails(!showPrivacyDetails)}
          >
            <Eye className="h-3 w-3" />
            {showPrivacyDetails ? 'Hide' : 'Show'} technical details
          </button>
        </div>

        {showPrivacyDetails && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <h4 className="font-medium text-blue-800 mb-2">Technical Privacy Features:</h4>
            <ul className="text-blue-700 space-y-1">
              <li>• Uses TFHE (Fully Homomorphic Encryption) for end-to-end security</li>
              <li>• Client-side key generation and encryption</li>
              <li>• Server processes data while encrypted</li>
              <li>• Results encrypted and decrypted only on your device</li>
              <li>• Zero raw data exposure throughout the entire process</li>
            </ul>
          </div>
        )}

        <div className="pt-4">
          <p className="text-gray-600 mb-4">
            This assessment takes about 2-3 minutes and consists of 9 questions. 
            Your responses will help provide insights into your mental wellbeing.
          </p>
          <Button
            onClick={() => setCurrentStep(1)}
            disabled={!encryptionInitialized}
            className="w-full"
          >
            {!encryptionInitialized ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing Secure Encryption...
              </>
            ) : (
              'Begin Assessment'
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderQuestionStep = () => {
    const questionIndex = currentStep - 1;
    const question = ASSESSMENT_QUESTIONS[questionIndex];
    
    if (!question) {
      return null;
    }

    const progress = (currentStep / ASSESSMENT_QUESTIONS.length) * 100;

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg border p-6 shadow-lg">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Question {currentStep} of {ASSESSMENT_QUESTIONS.length}</span>
            <span className="text-sm text-green-600 flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Encrypted
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">{question.text}</h3>
            {question.description && (
              <p className="text-gray-600 text-sm">{question.description}</p>
            )}
          </div>

          <div className="space-y-3">
            {RESPONSE_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.value}
                  checked={responses[question.id] === option.value}
                  onChange={() => handleResponseChange(question.id, option.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep === ASSESSMENT_QUESTIONS.length ? (
              <Button
                onClick={submitAssessment}
                disabled={!responses[question.id] || isProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                Complete Assessment
              </Button>
            ) : (
              <Button
                onClick={goToNextStep}
                disabled={!responses[question.id]}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProcessingStep = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-lg border p-6 shadow-lg">
      <div className="text-center py-12">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600 mb-4" />
        <h3 className="text-lg font-medium mb-2">Processing Your Assessment</h3>
        <p className="text-gray-600 mb-4">
          Analyzing your encrypted responses using our secure AI model...
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
          🔒 Your responses remain encrypted throughout this process
        </div>
      </div>
    </div>
  );

  const renderResultsStep = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-lg border p-6 shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center text-gray-900">Assessment Complete</h1>
        <p className="text-center text-gray-600 mt-2">
          Your secure mental health assessment results
        </p>
      </div>

      <div className="space-y-6 text-center">
        {result && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Depression Level Assessment</h3>
              <div className={`text-3xl font-bold mb-2 ${
                result.depressionLevel === 'No' ? 'text-green-600' :
                result.depressionLevel === 'Low' ? 'text-yellow-600' :
                result.depressionLevel === 'Mild' ? 'text-orange-600' : 'text-red-600'
              }`}>
                {result.depressionLevel}
              </div>
              <div className="text-sm text-gray-600">
                Confidence: {result.confidenceScore}%
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Privacy Maintained</span>
              </div>
              <p className="text-sm text-green-700">
                This result was computed without our servers ever seeing your raw responses.
                Your privacy has been protected throughout the entire process.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Button onClick={resetAssessment} className="w-full">
            Take Another Assessment
          </Button>
          <p className="text-xs text-gray-500">
            Results are not stored. This information is for your awareness only and should not replace professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <h3 className="font-medium mb-2">Error</h3>
          <p>{error}</p>
        </div>
        <Button onClick={resetAssessment} className="w-full mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      {currentStep === 0 && renderIntroStep()}
      {currentStep >= 1 && currentStep <= ASSESSMENT_QUESTIONS.length && renderQuestionStep()}
      {currentStep === 10 && renderProcessingStep()}
      {currentStep === 11 && renderResultsStep()}
    </div>
  );
}