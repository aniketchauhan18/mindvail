/**
 * Mental Health Assessment Page
 * Secure questionnaire with homomorphic encryption for privacy protection
 */

import MentalHealthAssessment from '@/components/mental-health-assessment';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mental Health Assessment - Mindvail',
  description: 'Take a secure, private mental health assessment with end-to-end encryption',
};

export default function AssessmentPage() {
  return (
    <div className="container mx-auto">
      <MentalHealthAssessment />
    </div>
  );
}