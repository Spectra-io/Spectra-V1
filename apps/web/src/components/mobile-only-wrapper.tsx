'use client';

import { useEffect, useState } from 'react';
import { Smartphone } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MobileOnlyWrapperProps {
  children: React.ReactNode;
}

export function MobileOnlyWrapper({ children }: MobileOnlyWrapperProps) {
  const [isMobile, setIsMobile] = useState(true); // Default to true to avoid flash

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));

      // Also check screen width
      const isMobileWidth = window.innerWidth < 768;

      setIsMobile(isMobileUA || isMobileWidth);
    };

    checkIfMobile();

    // Re-check on resize
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (!isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <Smartphone className="w-20 h-20 mx-auto mb-6 text-primary-500" />
          <h1 className="text-3xl font-bold mb-4">Mobile Only</h1>
          <p className="text-gray-600 mb-4">
            This application is designed for mobile devices only.
          </p>
          <p className="text-sm text-gray-500">
            Please access this page from your smartphone to use KYC verification with camera features.
          </p>
          <div className="mt-8 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-700 font-medium">
              Scan the QR code from your phone or enter the URL:
            </p>
            <p className="text-xs text-purple-600 mt-2 font-mono break-all">
              {typeof window !== 'undefined' ? window.location.href : ''}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
