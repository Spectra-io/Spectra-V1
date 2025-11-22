import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';

const router = Router();
const prisma = new PrismaClient();

// Get all active anchors
router.get('/', async (req: Request, res: Response) => {
  try {
    const anchors = await prisma.anchor.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        domain: true,
        requiredClaims: true,
      },
    });

    res.json({
      success: true,
      data: { anchors },
    });
  } catch (error: any) {
    console.error('Get anchors error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get anchors',
    });
  }
});

// Get anchor by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const anchor = await prisma.anchor.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        domain: true,
        requiredClaims: true,
        isActive: true,
      },
    });

    if (!anchor) {
      return res.status(404).json({
        success: false,
        error: 'Anchor not found',
      });
    }

    res.json({
      success: true,
      data: { anchor },
    });
  } catch (error: any) {
    console.error('Get anchor error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get anchor',
    });
  }
});

// Create anchor (for demo/testing)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, domain, publicKey, requiredClaims } = req.body;

    if (!name || !domain || !publicKey) {
      return res.status(400).json({
        success: false,
        error: 'Name, domain, and public key are required',
      });
    }

    const anchor = await prisma.anchor.create({
      data: {
        name,
        domain,
        publicKey,
        requiredClaims: requiredClaims || ['identity_verification'],
      },
    });

    res.json({
      success: true,
      data: { anchor },
    });
  } catch (error: any) {
    console.error('Create anchor error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create anchor',
    });
  }
});

export default router;
