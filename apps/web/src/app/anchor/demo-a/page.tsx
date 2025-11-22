'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, CheckCircle, Shield, DollarSign, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { useStellar } from '@/lib/hooks/use-stellar';
import { apiClient } from '@/lib/api';

export default function AnchorADemo() {
  const { publicKey, isConnected } = useStellar();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [credentials, setCredentials] = useState<any[]>([]);

  const ANCHOR_A_ID = 'anchor-a-demo-id'; // In production, this would come from API

  const verifyWithKycGlobal = async () => {
    if (!publicKey) {
      toast({
        title: 'Wallet Required',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }

    setIsVerifying(true);

    try {
      // Get user credentials
      const credsResponse = await apiClient.getUserCredentials(publicKey);

      if (credsResponse.success && credsResponse.data) {
        const userCreds = credsResponse.data.credentials;

        if (userCreds.length === 0) {
          toast({
            title: 'No KYC Found',
            description: 'Please complete KYC verification first',
            variant: 'destructive',
          });
          return;
        }

        setCredentials(userCreds);
        setIsVerified(true);

        toast({
          title: 'Verification Successful',
          description: 'Your KYC Global credentials have been verified',
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: 'Verification Failed',
        description: 'Unable to verify credentials',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-6 h-6 text-blue-500" />
              <span className="font-bold text-xl">Anchor A - USD Services</span>
            </div>
            <div className="text-sm text-gray-600">Powered by KYC Global</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome to Anchor A</h1>
              <p className="text-gray-600">Deposit and withdraw USD using your bank account</p>
            </div>

            {!isVerified ? (
              <div className="space-y-6">
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <Shield className="w-8 h-8 text-primary-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">KYC Global Verification</h3>
                      <p className="text-gray-600 mb-4">
                        We use KYC Global for instant verification. If you&apos;ve already
                        completed KYC with them, you can access our services immediately.
                      </p>
                      <Button
                        onClick={verifyWithKycGlobal}
                        disabled={isVerifying || !isConnected}
                        className="bg-primary-500 hover:bg-primary-600"
                      >
                        {isVerifying ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Verify with KYC Global
                          </>
                        )}
                      </Button>
                      {!isConnected && (
                        <p className="text-sm text-gray-500 mt-2">
                          Please connect your wallet first
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <DollarSign className="w-8 h-8 text-green-500 mb-2" />
                    <h4 className="font-semibold">Low Fees</h4>
                    <p className="text-sm text-gray-600">Only 0.5% per transaction</p>
                  </Card>
                  <Card className="p-4">
                    <CheckCircle className="w-8 h-8 text-blue-500 mb-2" />
                    <h4 className="font-semibold">Instant Processing</h4>
                    <p className="text-sm text-gray-600">Deposits clear in minutes</p>
                  </Card>
                  <Card className="p-4">
                    <Shield className="w-8 h-8 text-purple-500 mb-2" />
                    <h4 className="font-semibold">Bank-Grade Security</h4>
                    <p className="text-sm text-gray-600">Your funds are protected</p>
                  </Card>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div>
                      <h3 className="font-semibold">Verification Complete</h3>
                      <p className="text-gray-600">Your KYC Global credentials are valid</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {credentials.map((cred, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">
                          {cred.type.replace(/_/g, ' ').toUpperCase()}: verified
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="bg-blue-500 hover:bg-blue-600 py-6">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Deposit USD
                  </Button>
                  <Button variant="outline" className="py-6">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Withdraw USD
                  </Button>
                </div>

                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600 mb-2">Want to try another anchor?</p>
                  <Button
                    variant="link"
                    onClick={() => (window.location.href = '/anchor/demo-b')}
                    className="text-primary-500"
                  >
                    Visit Anchor B →
                  </Button>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
