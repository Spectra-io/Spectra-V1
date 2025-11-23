'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Copy, Check } from 'lucide-react';
import { useStellar } from '@/lib/hooks/use-stellar';
import { useToast } from '@/components/ui/toast';

interface WalletConnectProps {
  onConnect?: (connected: boolean) => void;
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const { publicKey, isConnected, isConnecting, connect, connectDemo, disconnect } = useStellar();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
      onConnect?.(true);
      toast({
        title: 'Wallet Connected',
        description: 'Successfully connected to your Stellar wallet',
      });
    } catch (error) {
      console.error('Connection failed:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to wallet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDemoConnect = () => {
    try {
      const address = connectDemo();
      onConnect?.(true);
      toast({
        title: 'Demo Mode',
        description: 'Connected with demo address for testing',
      });
    } catch (error) {
      console.error('Demo connection failed:', error);
      toast({
        title: 'Demo Connection Failed',
        description: 'Failed to connect in demo mode',
        variant: 'destructive',
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    onConnect?.(false);
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
    });
  };

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Address Copied',
        description: 'Wallet address copied to clipboard',
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (isConnected && publicKey) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={copyAddress}
          className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
        >
          <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">{formatAddress(publicKey)}</span>
          {copied ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDisconnect}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1 sm:p-2"
        >
          <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleDemoConnect}
      disabled={isConnecting}
      size="sm"
      className="bg-primary-500 hover:bg-primary-600 text-white text-xs sm:text-sm px-3 sm:px-4"
    >
      {isConnecting ? (
        <>
          <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <Wallet className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          Connect Demo
        </>
      )}
    </Button>
  );
}
