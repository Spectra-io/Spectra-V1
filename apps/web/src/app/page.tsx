'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Globe, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WalletConnect } from '@/components/wallet/wallet-connect';

export default function HomePage() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'One-Time KYC',
      description: 'Complete verification once, use everywhere in Stellar',
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Instant Verification',
      description: 'Get verified in minutes, not days',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Acceptance',
      description: 'Accepted by all participating anchors',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Privacy First',
      description: 'Zero-knowledge proofs protect your data',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">Spectra</span>
            </div>
            <WalletConnect onConnect={setIsConnected} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              One KYC.
              <span className="text-primary-500"> Endless Possibilities.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Complete your identity verification once and access any service in the Stellar
              ecosystem. Secure, private, and universally accepted.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/kyc')}
                disabled={!isConnected}
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-6 text-lg rounded-xl"
              >
                Start Verification
              </Button>
              <Button
                onClick={() => router.push('/demo')}
                variant="outline"
                className="px-8 py-6 text-lg rounded-xl"
              >
                View Demo
              </Button>
            </div>

            {!isConnected && (
              <p className="mt-4 text-sm text-gray-500">
                Connect your wallet to begin verification
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 text-primary-500">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Submit Documents', desc: 'Upload your ID and take a selfie' },
              { step: '2', title: 'Get Verified', desc: 'Our system verifies your identity' },
              { step: '3', title: 'Access Services', desc: 'Use your credential with any anchor' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-primary-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl p-12 text-white shadow-2xl"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join the future of identity verification on Stellar
            </p>
            <Button
              onClick={() => (isConnected ? router.push('/kyc') : null)}
              disabled={!isConnected}
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl"
            >
              {isConnected ? 'Start Your KYC Now' : 'Connect Wallet First'}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>Built with ❤️ for the Stellar ecosystem</p>
          <p className="text-sm mt-2">Spectra - Universal KYC for Web3</p>
        </div>
      </footer>
    </div>
  );
}
