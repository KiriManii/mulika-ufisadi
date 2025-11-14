/**
 * Verification Form Component
 * Mulika Ufisadi - Corruption Reporting Platform
 * Multi-step verification for reward claims
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { COUNTIES } from '../../constants/counties';
import { generateHash } from '../../lib/encryption';
import type { VerificationQuestion } from '../../types/reward';

interface VerificationFormProps {
  questions: VerificationQuestion[];
  onVerificationComplete: () => void;
  onVerificationFailed: () => void;
}

const verificationSchema = z.object({
  answer: z.string().min(1, 'Answer is required'),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

export function VerificationForm({
  questions,
  onVerificationComplete,
  onVerificationFailed,
}: VerificationFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [verificationState, setVerificationState] = useState<VerificationQuestion[]>(questions);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
  });

  const currentQuestion = verificationState[currentStep];
  const progress = ((currentStep + 1) / verificationState.length) * 100;

  // Determine question type based on question text
  const getQuestionType = (question: string): 'county' | 'amount' | 'text' => {
    if (question.toLowerCase().includes('county')) return 'county';
    if (question.toLowerCase().includes('amount')) return 'amount';
    return 'text';
  };

  const onSubmit = (data: VerificationFormData) => {
    const hashedAnswer = generateHash(data.answer);
    const isCorrect = hashedAnswer === currentQuestion.hashedAnswer;

    if (isCorrect) {
      // Correct answer - move to next question or complete
      if (currentStep < verificationState.length - 1) {
        setCurrentStep(currentStep + 1);
        setError(null);
        reset();
      } else {
        // All questions answered correctly
        onVerificationComplete();
      }
    } else {
      // Incorrect answer - increment attempts
      const updatedQuestions = [...verificationState];
      updatedQuestions[currentStep] = {
        ...currentQuestion,
        attempts: currentQuestion.attempts + 1,
      };
      setVerificationState(updatedQuestions);

      const remainingAttempts = currentQuestion.maxAttempts - currentQuestion.attempts - 1;

      if (remainingAttempts <= 0) {
        // No more attempts - verification failed
        setError('Maximum attempts exceeded. Verification failed.');
        setTimeout(() => {
          onVerificationFailed();
        }, 2000);
      } else {
        setError(
          `Incorrect answer. You have ${remainingAttempts} attempt${
            remainingAttempts === 1 ? '' : 's'
          } remaining.`
        );
      }
    }
  };

  const questionType = getQuestionType(currentQuestion.question);
  const isLocked = currentQuestion.attempts >= currentQuestion.maxAttempts;

  const countyOptions = COUNTIES.map((county) => ({
    value: county.name.toLowerCase(),
    label: county.name,
  }));

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-700">
            Question {currentStep + 1} of {verificationState.length}
          </span>
          <span className="text-sm font-medium text-primary-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Verification Form */}
      <AnimatePresence mode="wait">
        <motion.div key={currentStep} {...fadeIn}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Question Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Verification Question
                </h3>
                <p className="text-base text-neutral-700">{currentQuestion.question}</p>
              </div>

              {/* Question Input - Different types based on question */}
              {questionType === 'county' && (
                <Select
                  label="Select County"
                  options={countyOptions}
                  placeholder="Choose the county..."
                  onChange={(value) => setValue('answer', value)}
                  error={errors.answer?.message}
                  disabled={isLocked}
                  required
                />
              )}

              {questionType === 'amount' && (
                <div className="space-y-4">
                  <Input
                    label="Approximate Amount (KES)"
                    type="number"
                    placeholder="Enter approximate amount..."
                    {...register('answer')}
                    error={errors.answer?.message}
                    disabled={isLocked}
                    required
                  />
                  <p className="text-sm text-neutral-500">
                    Enter the approximate amount within the same range (e.g., if it was KES 5,000,
                    enter any value between 4,000-6,000)
                  </p>
                </div>
              )}

              {questionType === 'text' && (
                <Input
                  label="Your Answer"
                  type="text"
                  placeholder="Enter your answer..."
                  {...register('answer')}
                  error={errors.answer?.message}
                  disabled={isLocked}
                  required
                />
              )}

              {/* Attempts Indicator */}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-neutral-600">Attempts:</span>
                <div className="flex gap-1">
                  {Array.from({ length: currentQuestion.maxAttempts }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index < currentQuestion.attempts
                          ? 'bg-red-500'
                          : 'bg-neutral-300'
                      }`}
                      aria-label={
                        index < currentQuestion.attempts
                          ? 'Failed attempt'
                          : 'Remaining attempt'
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-sm text-red-700 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {error}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLocked}
            >
              {currentStep < verificationState.length - 1 ? 'Next Question' : 'Complete Verification'}
            </Button>
          </form>
        </motion.div>
      </AnimatePresence>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
        <p className="text-sm text-primary-800">
          <strong>Security Tip:</strong> These questions verify you are the original reporter.
          Answers are case-insensitive and stored as secure hashes.
        </p>
      </div>
    </div>
  );
}
