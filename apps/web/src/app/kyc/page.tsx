'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Check, ArrowRight, User, FileText, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { PersonalInfoForm } from '@/components/kyc/personal-info';
import { DocumentCapture } from '@/components/kyc/document-capture';
import { SelfieCapture } from '@/components/kyc/selfie-capture';
import { useStellar } from '@/lib/hooks/use-stellar';
import { useKyc } from '@/lib/hooks/use-kyc';
import type { PersonalInfo } from '@spectra/shared';

type Step = 'personal' | 'document' | 'selfie' | 'processing' | 'complete';

export default function KycPage() {
  const router = useRouter();
  const { publicKey, isConnected } = useStellar();
  const { submitKyc, isLoading } = useKyc(publicKey);
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [kycData, setKycData] = useState<{
    personalInfo?: PersonalInfo;
    documentImage?: string;
    selfieImage?: string;
  }>({});

  // Don't redirect immediately - let user see the page

  const steps = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'document', name: 'Document', icon: FileText },
    { id: 'selfie', name: 'Selfie', icon: Camera },
    { id: 'processing', name: 'Processing', icon: Shield },
  ];

  const handlePersonalInfoComplete = (data: PersonalInfo) => {
    setKycData(prev => ({ ...prev, personalInfo: data }));
    setCurrentStep('document');
  };

  const handleDocumentComplete = (data: { documentImage: string }) => {
    setKycData(prev => ({ ...prev, documentImage: data.documentImage }));
    setCurrentStep('selfie');
  };

  const handleSelfieComplete = async (data: { selfieImage: string }) => {
    setKycData(prev => ({ ...prev, selfieImage: data.selfieImage }));
    setCurrentStep('processing');

    // Submit KYC
    try {
      if (!kycData.personalInfo || !kycData.documentImage) {
        throw new Error('Missing KYC data');
      }

      await submitKyc(kycData.personalInfo, {
        document: kycData.documentImage,
        selfie: data.selfieImage,
      });

      // Wait a bit to show processing animation
      await new Promise(resolve => setTimeout(resolve, 3000));

      setCurrentStep('complete');
      toast({
        title: 'Verification Complete!',
        description: 'Your identity has been verified successfully',
      });
    } catch (error) {
      console.error('KYC submission error:', error);
      toast({
        title: 'Verification Failed',
        description: 'Failed to submit verification. Please try again.',
        variant: 'destructive',
      });
      setCurrentStep('selfie');
    }
  };

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  // Show connection required message if not connected
  if (!isConnected || !publicKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-primary-500" />
          <h1 className="text-2xl font-bold mb-2">Wallet Connection Required</h1>
          <p className="text-gray-600 mb-6">
            You need to connect your wallet to access the KYC verification process.
          </p>
          <Button
            onClick={() => router.push('/')}
            className="bg-primary-500 hover:bg-primary-600 text-white w-full"
          >
            Go Back Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Progress Bar */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isComplete = currentStepIndex > index;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full transition-colors
                      ${
                        isComplete
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }
                    `}
                  >
                    {isComplete ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-colors ${
                        isComplete ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold">
              {steps.find(s => s.id === currentStep)?.name}
            </h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 'personal' && (
              <PersonalInfoForm onComplete={handlePersonalInfoComplete} />
            )}

            {currentStep === 'document' && (
              <DocumentCapture onComplete={handleDocumentComplete} />
            )}

            {currentStep === 'selfie' && <SelfieCapture onComplete={handleSelfieComplete} />}

            {currentStep === 'processing' && (
              <Card className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-10 h-10 text-primary-500 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Verifying Your Identity</h3>
                  <p className="text-gray-600">This usually takes just a few seconds...</p>
                </div>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              </Card>
            )}

            {currentStep === 'complete' && (
              <Card className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-12 h-12 text-green-500" />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-2">Verification Complete!</h3>
                <p className="text-gray-600 mb-6">
                  Your identity has been successfully verified. You can now access services across
                  the Stellar network.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push('/anchor/demo-a')}
                    className="w-full bg-primary-500 hover:bg-primary-600"
                  >
                    Try Demo Anchor A
                  </Button>
                  <Button
                    onClick={() => router.push('/anchor/demo-b')}
                    variant="outline"
                    className="w-full"
                  >
                    Try Demo Anchor B
                  </Button>
                  <Button
                    onClick={() => router.push('/')}
                    variant="ghost"
                    className="w-full text-gray-600"
                  >
                    Return Home
                  </Button>
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
