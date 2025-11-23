import { PrismaClient, KycStatus } from '@prisma/client';
import crypto from 'crypto';
import { z } from 'zod';
import type { PersonalInfo } from '@spectra/shared';
import { zkService } from './zk.service';

const prisma = new PrismaClient();

// Validation schemas
const KycDataSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().optional(),
    country: z.string().min(2),
    postalCode: z.string().min(1),
  }),
  documentType: z.enum(['passport', 'driver_license', 'national_id']),
  documentNumber: z.string().min(1, 'Document number is required'),
});

export class KycService {
  // Encrypt sensitive data using AES-256-GCM
  private encryptData(data: any): { encrypted: string; iv: string; authTag: string } {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.ENCRYPTION_KEY || this.generateKey(), 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    };
  }

  // Generate encryption key if not provided
  private generateKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Decrypt data (for internal use only)
  private decryptData(encrypted: string, iv: string, authTag: string): any {
    try {
      const algorithm = 'aes-256-gcm';
      const key = Buffer.from(process.env.ENCRYPTION_KEY || this.generateKey(), 'hex');
      const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  // Hash document for privacy
  private hashDocument(document: Buffer | string): string {
    const data = typeof document === 'string' ? Buffer.from(document, 'base64') : document;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Create or get user by Stellar account
  private async getOrCreateUser(stellarAccount: string, email?: string) {
    let user = await prisma.user.findUnique({
      where: { stellarAccount },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          stellarAccount,
          email,
        },
      });
    }

    return user;
  }

  // Submit KYC
  async submitKyc(
    stellarAccount: string,
    kycData: PersonalInfo,
    files: { document: string; selfie: string }
  ) {
    try {
      // Validate input
      const validatedData = KycDataSchema.parse(kycData);

      // Get or create user
      const user = await this.getOrCreateUser(stellarAccount);

      // Encrypt personal data
      const { encrypted, iv, authTag } = this.encryptData(validatedData);

      // Hash documents
      const documentHash = this.hashDocument(files.document);
      const selfieHash = this.hashDocument(files.selfie);

      // Create data hash for integrity
      const dataHash = crypto
        .createHash('sha256')
        .update(JSON.stringify(validatedData))
        .digest('hex');

      // Check if KYC already exists
      const existingKyc = await prisma.kycSubmission.findUnique({
        where: { userId: user.id },
      });

      if (existingKyc) {
        // Update existing KYC
        const submission = await prisma.kycSubmission.update({
          where: { userId: user.id },
          data: {
            encryptedData: { data: encrypted, iv, authTag },
            dataHash,
            documentType: validatedData.documentType,
            documentHash,
            selfieHash,
            status: 'PROCESSING',
            rejectionReason: null,
          },
        });

        // Trigger verification process
        setTimeout(() => this.processVerification(submission.id), 2000);

        return submission;
      }

      // Create new KYC submission
      const submission = await prisma.kycSubmission.create({
        data: {
          userId: user.id,
          encryptedData: { data: encrypted, iv, authTag },
          dataHash,
          documentType: validatedData.documentType,
          documentHash,
          selfieHash,
          status: 'PROCESSING',
        },
      });

      // Trigger async verification process
      setTimeout(() => this.processVerification(submission.id), 2000);

      return submission;
    } catch (error) {
      console.error('KYC submission error:', error);
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new Error('Failed to submit KYC');
    }
  }

  // Process verification (mock for hackathon)
  private async processVerification(submissionId: string) {
    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock verification logic (always approve for demo)
      // In production, this would call external KYC provider or AI verification
      const submission = await prisma.kycSubmission.update({
        where: { id: submissionId },
        data: {
          status: 'APPROVED',
          verifiedAt: new Date(),
        },
        include: { user: true },
      });

      // Generate credentials after approval
      await this.generateCredentials(submission.userId);

      console.log(`✅ KYC approved for user ${submission.userId}`);
    } catch (error) {
      console.error('Verification error:', error);
      // Mark as needs info if verification fails
      await prisma.kycSubmission.update({
        where: { id: submissionId },
        data: {
          status: 'NEEDS_INFO',
          rejectionReason: 'Verification service temporarily unavailable',
        },
      });
    }
  }

  // Generate verifiable credentials
  async generateCredentials(userId: string) {
    const credentialTypes = [
      {
        type: 'identity_verification',
        claims: {
          verified: true,
          level: 'standard',
          method: 'document_selfie',
          verifiedAt: new Date().toISOString(),
        },
      },
      {
        type: 'age_verification',
        claims: {
          over18: true,
          over21: true,
          verifiedAt: new Date().toISOString(),
        },
      },
      {
        type: 'aml_check',
        claims: {
          passed: true,
          checkedAt: new Date().toISOString(),
          riskLevel: 'low',
        },
      },
    ];

    // Delete old credentials before creating new ones
    await prisma.credential.deleteMany({
      where: { userId },
    });

    for (const cred of credentialTypes) {
      await this.createCredential(userId, cred.type, cred.claims);
    }
  }

  // Create a verifiable credential with signature
  async createCredential(userId: string, type: string, claims: any) {
    let proof: any;

    // Generate ZK proof for age verification
    if (type === 'age_verification') {
      try {
        // In production, birthYear would come from encrypted KYC data
        // For demo, we calculate it from current year assuming over 18
        const currentYear = new Date().getFullYear();
        const birthYear = currentYear - 25; // Mock: user is 25 years old

        const zkProof = await zkService.generateAgeProof(birthYear, currentYear, 18);

        proof = {
          type: 'ZkProof2023',
          created: new Date().toISOString(),
          proofPurpose: 'assertionMethod',
          verificationMethod: 'did:spectra:kyc-global',
          zkProof: zkProof.proof,
          publicSignals: zkProof.publicSignals,
        };
      } catch (error) {
        console.error('Failed to generate ZK proof, falling back to signature:', error);
        proof = this.generateSignatureProof(type, claims);
      }
    } else {
      // For other credential types, use signature-based proof
      proof = this.generateSignatureProof(type, claims);
    }

    const credential = await prisma.credential.create({
      data: {
        userId,
        type,
        claims,
        proof,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
    });

    return credential;
  }

  // Generate signature-based proof (non-ZK)
  private generateSignatureProof(type: string, claims: any) {
    const proofData = {
      type: 'RsaSignature2018',
      created: new Date().toISOString(),
      proofPurpose: 'assertionMethod',
      verificationMethod: 'did:spectra:kyc-global',
    };

    // Create signature over claims
    const dataToSign = JSON.stringify({ type, claims, ...proofData });
    const signature = crypto.createHash('sha256').update(dataToSign).digest('hex');

    return {
      ...proofData,
      jws: signature,
    };
  }

  // Get KYC status
  async getKycStatus(stellarAccount: string) {
    const user = await prisma.user.findUnique({
      where: { stellarAccount },
      include: {
        kycSubmission: {
          select: {
            id: true,
            status: true,
            verifiedAt: true,
            rejectionReason: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user || !user.kycSubmission) {
      return { status: 'NOT_SUBMITTED' };
    }

    return user.kycSubmission;
  }

  // Get user credentials
  async getUserCredentials(stellarAccount: string) {
    const user = await prisma.user.findUnique({
      where: { stellarAccount },
    });

    if (!user) {
      return [];
    }

    return prisma.credential.findMany({
      where: {
        userId: user.id,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });
  }

  // Verify credential for anchor
  async verifyCredentialForAnchor(stellarAccount: string, anchorId: string) {
    const user = await prisma.user.findUnique({
      where: { stellarAccount },
    });

    if (!user) {
      return { verified: false, credentials: [] };
    }

    // Get anchor requirements
    const anchor = await prisma.anchor.findUnique({
      where: { id: anchorId },
    });

    if (!anchor) {
      throw new Error('Anchor not found');
    }

    // Get user credentials
    const credentials = await prisma.credential.findMany({
      where: {
        userId: user.id,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    // Check if user has all required credentials
    const hasAllRequired = anchor.requiredClaims.every(required =>
      credentials.some(cred => cred.type === required)
    );

    if (hasAllRequired) {
      // Log access
      await prisma.anchorAccess.upsert({
        where: {
          userId_anchorId: { userId: user.id, anchorId },
        },
        create: { userId: user.id, anchorId },
        update: { lastAccessed: new Date() },
      });
    }

    return {
      verified: hasAllRequired,
      credentials: hasAllRequired ? credentials : [],
    };
  }

  // Revoke credential
  async revokeCredential(credentialId: string) {
    return prisma.credential.update({
      where: { id: credentialId },
      data: { revoked: true },
    });
  }
}

export const kycService = new KycService();
