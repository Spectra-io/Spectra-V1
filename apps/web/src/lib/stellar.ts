import * as StellarSdk from '@stellar/stellar-sdk';
import albedo from '@albedo-link/intent';

export class StellarService {
  private server: StellarSdk.Horizon.Server;
  private networkPassphrase: string;

  constructor() {
    const horizonUrl =
      process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org';
    const network = process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'testnet';

    this.server = new StellarSdk.Horizon.Server(horizonUrl);
    this.networkPassphrase =
      network === 'testnet' ? StellarSdk.Networks.TESTNET : StellarSdk.Networks.PUBLIC;
  }

  // Generate demo Stellar address for testing
  generateDemoAddress(): string {
    try {
      // Generate a random keypair
      const keypair = StellarSdk.Keypair.random();
      // Return the public key
      return keypair.publicKey();
    } catch (error) {
      console.error('Failed to generate demo address:', error);
      throw new Error('Failed to generate demo address');
    }
  }

  // Connect wallet using Albedo
  async connectWallet(): Promise<string> {
    try {
      const result = await albedo.publicKey({
        require_existing: false,
      });
      return result.pubkey;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw new Error('Failed to connect wallet');
    }
  }

  // Sign message with Albedo
  async signMessage(message: string, publicKey: string): Promise<string> {
    try {
      const result = await albedo.signMessage({
        message,
        pubkey: publicKey,
      });
      return result.message_signature;
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw new Error('Failed to sign message');
    }
  }

  // Sign transaction with Albedo
  async signTransaction(xdr: string, publicKey: string): Promise<string> {
    try {
      const result = await albedo.tx({
        xdr,
        pubkey: publicKey,
        network: process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'testnet',
        submit: false,
      });
      return result.signed_envelope_xdr;
    } catch (error) {
      console.error('Failed to sign transaction:', error);
      throw new Error('Failed to sign transaction');
    }
  }

  // Load account from Horizon
  async loadAccount(publicKey: string): Promise<StellarSdk.Horizon.AccountResponse> {
    try {
      return await this.server.loadAccount(publicKey);
    } catch (error) {
      console.error('Failed to load account:', error);
      throw new Error('Account not found or not funded');
    }
  }

  // Check if account exists
  async accountExists(publicKey: string): Promise<boolean> {
    try {
      await this.server.loadAccount(publicKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Create trustline
  async createTrustline(
    publicKey: string,
    assetCode: string,
    assetIssuer: string
  ): Promise<void> {
    try {
      const account = await this.server.loadAccount(publicKey);
      const asset = new StellarSdk.Asset(assetCode, assetIssuer);

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          StellarSdk.Operation.changeTrust({
            asset: asset,
          })
        )
        .setTimeout(30)
        .build();

      const signedXdr = await this.signTransaction(transaction.toXDR(), publicKey);
      const signedTx = new StellarSdk.Transaction(signedXdr, this.networkPassphrase);

      await this.server.submitTransaction(signedTx);
    } catch (error) {
      console.error('Failed to create trustline:', error);
      throw new Error('Failed to create trustline');
    }
  }

  // SEP-10 Authentication Challenge
  async getSEP10Challenge(serverUrl: string, publicKey: string): Promise<string> {
    try {
      const response = await fetch(`${serverUrl}/auth?account=${publicKey}`);
      const data = await response.json();
      return data.transaction;
    } catch (error) {
      console.error('Failed to get SEP-10 challenge:', error);
      throw new Error('Failed to get authentication challenge');
    }
  }

  // Sign SEP-10 Challenge
  async signSEP10Challenge(challengeXdr: string, publicKey: string): Promise<string> {
    try {
      const signedXdr = await this.signTransaction(challengeXdr, publicKey);
      return signedXdr;
    } catch (error) {
      console.error('Failed to sign SEP-10 challenge:', error);
      throw new Error('Failed to sign authentication challenge');
    }
  }

  // Submit SEP-10 signed challenge
  async submitSEP10Challenge(serverUrl: string, signedXdr: string): Promise<string> {
    try {
      const response = await fetch(`${serverUrl}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transaction: signedXdr }),
      });

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Failed to submit SEP-10 challenge:', error);
      throw new Error('Failed to complete authentication');
    }
  }

  // Complete SEP-10 authentication flow
  async authenticateSEP10(serverUrl: string, publicKey: string): Promise<string> {
    try {
      // Step 1: Get challenge
      const challengeXdr = await this.getSEP10Challenge(serverUrl, publicKey);

      // Step 2: Sign challenge
      const signedXdr = await this.signSEP10Challenge(challengeXdr, publicKey);

      // Step 3: Submit signed challenge and get token
      const token = await this.submitSEP10Challenge(serverUrl, signedXdr);

      return token;
    } catch (error) {
      console.error('SEP-10 authentication failed:', error);
      throw new Error('Authentication failed');
    }
  }

  // Get network info
  getNetworkInfo() {
    return {
      network: process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'testnet',
      horizonUrl: process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org',
      networkPassphrase: this.networkPassphrase,
    };
  }
}

// Export singleton instance
export const stellarService = new StellarService();
