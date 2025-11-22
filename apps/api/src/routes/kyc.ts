import { Router } from 'express';
import { kycService } from '../services/kyc.service';
import type { Request, Response } from 'express';

const router = Router();

// Submit KYC
router.post('/submit', async (req: Request, res: Response) => {
  try {
    const { stellarAccount, kycData, files } = req.body;

    if (!stellarAccount) {
      return res.status(400).json({
        success: false,
        error: 'Stellar account is required',
      });
    }

    if (!kycData || !files) {
      return res.status(400).json({
        success: false,
        error: 'KYC data and files are required',
      });
    }

    const submission = await kycService.submitKyc(stellarAccount, kycData, files);

    res.json({
      success: true,
      data: {
        submissionId: submission.id,
        status: submission.status,
        createdAt: submission.createdAt,
      },
    });
  } catch (error: any) {
    console.error('KYC submission error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to submit KYC',
    });
  }
});

// Check KYC status
router.get('/status/:stellarAccount', async (req: Request, res: Response) => {
  try {
    const { stellarAccount } = req.params;

    if (!stellarAccount) {
      return res.status(400).json({
        success: false,
        error: 'Stellar account is required',
      });
    }

    const status = await kycService.getKycStatus(stellarAccount);

    res.json({
      success: true,
      data: status,
    });
  } catch (error: any) {
    console.error('Get KYC status error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to get KYC status',
    });
  }
});

// Get user credentials
router.get('/credentials/:stellarAccount', async (req: Request, res: Response) => {
  try {
    const { stellarAccount } = req.params;

    if (!stellarAccount) {
      return res.status(400).json({
        success: false,
        error: 'Stellar account is required',
      });
    }

    const credentials = await kycService.getUserCredentials(stellarAccount);

    res.json({
      success: true,
      data: { credentials },
    });
  } catch (error: any) {
    console.error('Get credentials error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to get credentials',
    });
  }
});

// Verify credentials for anchor
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { stellarAccount, anchorId } = req.body;

    if (!stellarAccount || !anchorId) {
      return res.status(400).json({
        success: false,
        error: 'Stellar account and anchor ID are required',
      });
    }

    const result = await kycService.verifyCredentialForAnchor(stellarAccount, anchorId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Verify credential error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to verify credentials',
    });
  }
});

// Revoke credential (admin only - would need auth middleware)
router.post('/revoke/:credentialId', async (req: Request, res: Response) => {
  try {
    const { credentialId } = req.params;

    if (!credentialId) {
      return res.status(400).json({
        success: false,
        error: 'Credential ID is required',
      });
    }

    await kycService.revokeCredential(credentialId);

    res.json({
      success: true,
      message: 'Credential revoked successfully',
    });
  } catch (error: any) {
    console.error('Revoke credential error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to revoke credential',
    });
  }
});

export default router;
