/**
 * Report Form Component
 * Mulika Ufisadi - Corruption Reporting Platform
 * Main form for submitting corruption reports
 */

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { EvidenceUpload } from './EvidenceUpload';
import { TokenDisplay } from './TokenDisplay';
import { useGeolocation } from '../../hooks/useGeolocation';
import { COUNTIES } from '../../constants/counties';
import { AGENCIES } from '../../constants/agencies';
import {
  Agency,
  Category,
  ReportStatus,
  type Report,
  type Coordinates,
  type ContactMethod,
} from '../../types/report';
import {
  generateReportToken,
  generateEncryptionKey,
  generateHash,
  encryptContactMethod,
} from '../../lib/encryption';
import { saveReport, getAnonymousId, saveRewardToken } from '../../lib/storage';
import type { RewardToken } from '../../types/reward';

const CATEGORIES = [
  { value: Category.Bribery, label: 'Bribery' },
  { value: Category.Extortion, label: 'Extortion' },
  { value: Category.Embezzlement, label: 'Embezzlement' },
  { value: Category.Nepotism, label: 'Nepotism' },
  { value: Category.ProcurementFraud, label: 'Procurement Fraud' },
  { value: Category.LandGrabbing, label: 'Land Grabbing' },
  { value: Category.Other, label: 'Other' },
];

const CONTACT_METHOD_TYPES = [
  { value: 'email', label: 'Email' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'signal', label: 'Signal' },
];

const evidenceSchema = z.object({
  type: z.enum(['image', 'document']),
  data: z.string(),
  filename: z.string(),
  size: z.number(),
});

const reportSchema = z.object({
  county: z.string().min(1, 'County is required'),
  agency: z.nativeEnum(Agency, { errorMap: () => ({ message: 'Please select an agency' }) }),
  categories: z
    .array(z.nativeEnum(Category))
    .min(1, 'Select at least one category')
    .max(3, 'Select at most 3 categories'),
  incidentDate: z.string().refine(
    (date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return selectedDate <= today;
    },
    { message: 'Date cannot be in the future' }
  ),
  estimatedAmount: z.string().optional(),
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  evidence: z.array(evidenceSchema).max(3, 'Maximum 3 files allowed').optional(),
  useLocation: z.boolean(),
  useContactMethod: z.boolean(),
  contactMethodType: z.enum(['email', 'telegram', 'signal']).optional(),
  contactMethodValue: z.string().optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

export function ReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<{
    tokenId: string;
    encryptionKey: string;
  } | null>(null);

  const { location, error: locationError, loading: locationLoading, getLocation } = useGeolocation();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      county: '',
      categories: [],
      incidentDate: '',
      description: '',
      evidence: [],
      useLocation: false,
      useContactMethod: false,
    },
  });

  const watchCategories = watch('categories');
  const watchUseLocation = watch('useLocation');
  const watchUseContactMethod = watch('useContactMethod');

  useEffect(() => {
    if (watchUseLocation && !location && !locationLoading) {
      getLocation();
    }
  }, [watchUseLocation]);

  const toggleCategory = (category: Category) => {
    const currentCategories = watchCategories || [];
    if (currentCategories.includes(category)) {
      setValue(
        'categories',
        currentCategories.filter((c) => c !== category)
      );
    } else {
      if (currentCategories.length < 3) {
        setValue('categories', [...currentCategories, category]);
      }
    }
  };

  const onSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true);

    try {
      const reportId = nanoid();
      const anonymousId = getAnonymousId();
      const tokenId = generateReportToken();
      const encryptionKey = generateEncryptionKey();

      let coordinates: Coordinates | undefined;
      if (data.useLocation && location) {
        coordinates = location;
      }

      let contactMethod: ContactMethod | undefined;
      if (data.useContactMethod && data.contactMethodType && data.contactMethodValue) {
        const encryptedValue = encryptContactMethod(data.contactMethodValue);
        contactMethod = {
          type: data.contactMethodType,
          value: encryptedValue,
          encrypted: true,
        };
      }

      const report: Report = {
        id: reportId,
        anonymousId,
        county: data.county,
        agency: data.agency,
        categories: data.categories,
        incidentDate: new Date(data.incidentDate),
        estimatedAmount: data.estimatedAmount ? parseFloat(data.estimatedAmount) : undefined,
        description: data.description,
        evidence: data.evidence,
        location: coordinates,
        contactMethod,
        submittedAt: new Date(),
        status: ReportStatus.Submitted,
      };

      saveReport(report);

      const verificationQuestions = [
        {
          question: 'What county did you report in?',
          hashedAnswer: generateHash(data.county.toLowerCase()),
          attempts: 0,
          maxAttempts: 3,
        },
        {
          question: 'What was the approximate amount (if provided)?',
          hashedAnswer: generateHash(
            data.estimatedAmount ? data.estimatedAmount.toString() : 'none'
          ),
          attempts: 0,
          maxAttempts: 3,
        },
        {
          question: 'What were the first 3 characters of your description?',
          hashedAnswer: generateHash(data.description.substring(0, 3).toLowerCase()),
          attempts: 0,
          maxAttempts: 3,
        },
      ];

      const qrData = JSON.stringify({ tokenId, encryptionKey });
      const qrCodeBase64 = `data:text/plain;base64,${btoa(qrData)}`;

      const rewardToken: RewardToken = {
        id: tokenId,
        reportId,
        encryptionKey,
        qrCode: qrCodeBase64,
        createdAt: new Date(),
        claimed: false,
        verificationQuestions,
      };

      saveRewardToken(rewardToken);

      setGeneratedToken({
        tokenId,
        encryptionKey,
      });

      setShowTokenModal(true);
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowTokenModal(false);
    window.location.href = '/';
  };

  const countyOptions = COUNTIES.map((county) => ({
    value: county.name,
    label: `${county.name} (${county.region})`,
  }));

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto p-6"
      >
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 font-primary mb-2">
              Report Corruption
            </h1>
            <p className="text-base text-neutral-600 font-primary">
              Your report is completely anonymous. All information is encrypted and secure.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="county"
                control={control}
                render={({ field }) => (
                  <Select
                    label="County"
                    options={countyOptions}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.county?.message}
                    required
                    placeholder="Select county..."
                  />
                )}
              />

              <Controller
                name="agency"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Government Agency"
                    options={AGENCIES}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.agency?.message}
                    required
                    placeholder="Select agency..."
                  />
                )}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-neutral-700 font-primary">
                Corruption Categories <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CATEGORIES.map((category) => {
                  const isSelected = watchCategories?.includes(category.value as Category);
                  return (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => toggleCategory(category.value as Category)}
                      className={`
                        px-4 py-2 rounded-lg border-2 transition-all duration-200 font-primary text-sm font-medium
                        ${
                          isSelected
                            ? 'bg-primary-500 border-primary-500 text-white'
                            : 'bg-white border-neutral-300 text-neutral-700 hover:border-primary-300'
                        }
                      `}
                    >
                      {category.label}
                    </button>
                  );
                })}
              </div>
              {errors.categories && (
                <p className="mt-1.5 text-sm text-red-500 font-primary" role="alert">
                  {errors.categories.message}
                </p>
              )}
              <p className="mt-1.5 text-xs text-neutral-500 font-primary">
                Select 1-3 categories that best describe the corruption
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Incident Date"
                type="date"
                {...register('incidentDate')}
                error={errors.incidentDate?.message}
                required
              />

              <Input
                label="Estimated Amount (KES)"
                type="number"
                placeholder="e.g., 5000"
                {...register('estimatedAmount')}
                error={errors.estimatedAmount?.message}
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-neutral-700 font-primary"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                {...register('description')}
                rows={6}
                className={`
                  w-full rounded-lg px-4 py-2 font-primary text-base transition-all duration-200 focus:outline-none resize-none
                  ${
                    errors.description
                      ? 'border-2 border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                  }
                `}
                placeholder="Describe the incident in detail. Include what happened, who was involved, when it occurred, and any other relevant information..."
              />
              <div className="flex items-center justify-between mt-1.5">
                {errors.description ? (
                  <p className="text-sm text-red-500 font-primary" role="alert">
                    {errors.description.message}
                  </p>
                ) : (
                  <p className="text-xs text-neutral-500 font-primary">
                    Minimum 50 characters, maximum 1000
                  </p>
                )}
                <p className="text-xs text-neutral-500 font-primary">
                  {watch('description')?.length || 0} / 1000
                </p>
              </div>
            </div>

            <Controller
              name="evidence"
              control={control}
              render={({ field }) => (
                <EvidenceUpload
                  evidence={field.value || []}
                  onChange={field.onChange}
                  error={errors.evidence?.message}
                  maxFiles={3}
                />
              )}
            />

            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="useLocation"
                  {...register('useLocation')}
                  className="mt-1 w-4 h-4 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <label
                    htmlFor="useLocation"
                    className="text-sm font-medium text-neutral-700 font-primary cursor-pointer"
                  >
                    Include my location (optional)
                  </label>
                  <p className="text-xs text-neutral-500 font-primary mt-0.5">
                    This helps verify the incident but is not required. Your identity remains
                    anonymous.
                  </p>
                  {watchUseLocation && locationLoading && (
                    <p className="text-xs text-primary-600 font-primary mt-1">
                      Getting location...
                    </p>
                  )}
                  {watchUseLocation && location && (
                    <p className="text-xs text-green-600 font-primary mt-1">
                      Location captured (Accuracy: ±{location.accuracy?.toFixed(0)}m)
                    </p>
                  )}
                  {watchUseLocation && locationError && (
                    <p className="text-xs text-red-500 font-primary mt-1">{locationError}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="useContactMethod"
                  {...register('useContactMethod')}
                  className="mt-1 w-4 h-4 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <label
                    htmlFor="useContactMethod"
                    className="text-sm font-medium text-neutral-700 font-primary cursor-pointer"
                  >
                    Provide contact method for updates (optional)
                  </label>
                  <p className="text-xs text-neutral-500 font-primary mt-0.5">
                    Encrypted and only used to notify you about your report status.
                  </p>

                  {watchUseContactMethod && (
                    <div className="mt-3 space-y-3">
                      <Controller
                        name="contactMethodType"
                        control={control}
                        render={({ field }) => (
                          <Select
                            label="Contact Method Type"
                            options={CONTACT_METHOD_TYPES}
                            value={field.value || ''}
                            onChange={field.onChange}
                            placeholder="Select method..."
                            required={watchUseContactMethod}
                          />
                        )}
                      />

                      <Input
                        label="Contact Value"
                        type="text"
                        placeholder="Enter email, Telegram username, or Signal number"
                        {...register('contactMethodValue')}
                        required={watchUseContactMethod}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-primary-900 font-primary mb-1">
                    Privacy & Security
                  </h3>
                  <ul className="text-xs text-primary-700 font-primary space-y-1">
                    <li>• Your report is completely anonymous</li>
                    <li>• All data is encrypted before storage</li>
                    <li>• We do not track IP addresses or device information</li>
                    <li>• You will receive a tracking token to claim rewards</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                fullWidth
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => window.history.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </motion.div>

      {generatedToken && (
        <TokenDisplay
          isOpen={showTokenModal}
          onClose={handleModalClose}
          tokenId={generatedToken.tokenId}
          encryptionKey={generatedToken.encryptionKey}
        />
      )}
    </>
  );
}
