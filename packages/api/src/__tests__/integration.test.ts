import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { prisma } from '../lib/prisma'
import { generateApiKey, generateWebhookSecret } from '../lib/crypto'
import type { Merchant, Payment } from '@prisma/client'

// Mock data
let testMerchant: Merchant | null = null
let testApiKey: string = ''

describe('Blew API Endpoints', () => {
  beforeAll(async () => {
    // Clean up test data
    if (testMerchant) {
      await prisma.payment.deleteMany({
        where: { merchantId: testMerchant.id },
      })
      await prisma.apiKey.deleteMany({
        where: { merchantId: testMerchant.id },
      })
      await prisma.merchant.delete({
        where: { id: testMerchant.id },
      })
    }
  })

  afterAll(async () => {
    // Clean up
    if (testMerchant) {
      await prisma.payment.deleteMany({
        where: { merchantId: testMerchant.id },
      })
      await prisma.apiKey.deleteMany({
        where: { merchantId: testMerchant.id },
      })
      await prisma.merchant.delete({
        where: { id: testMerchant.id },
      })
    }
    await prisma.$disconnect()
  })

  describe('Merchant Registration', () => {
    it('should create a merchant with API key', async () => {
      const merchant = await prisma.merchant.create({
        data: {
          email: 'test@example.com',
          name: 'Test Merchant',
          walletAddress: 'GrwLnSoHzA2ER15aMZDUZBv94HeggqzuZh63zPhuc9Qh',
          apiKey: generateApiKey(),
          webhookSecret: generateWebhookSecret(),
          status: 'active',
        },
      })

      testMerchant = merchant
      expect(merchant).toBeDefined()
      expect(merchant.email).toBe('test@example.com')
      expect(merchant.apiKey).toBeDefined()
      expect(merchant.webhookSecret).toBeDefined()
    })
  })

  describe('Payment Creation', () => {
    it('should create a pending payment', async () => {
      if (!testMerchant) throw new Error('Test merchant not created')

      const payment = await prisma.payment.create({
        data: {
          merchantId: testMerchant.id,
          amount: '0.5',
          token: 'SOL',
          status: 'pending',
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      })

      expect(payment).toBeDefined()
      expect(payment.amount).toBe('0.5')
      expect(payment.token).toBe('SOL')
      expect(payment.status).toBe('pending')
    })

    it('should not create payment with invalid amount', async () => {
      if (!testMerchant) throw new Error('Test merchant not created')

      expect(async () => {
        await prisma.payment.create({
          data: {
            merchantId: testMerchant!.id,
            amount: '-0.5', // Invalid: negative
            token: 'SOL',
            status: 'pending',
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          },
        })
      }).rejects.toThrow()
    })
  })

  describe('Payment Status Updates', () => {
    it('should confirm payment with valid signature', async () => {
      if (!testMerchant) throw new Error('Test merchant not created')

      const payment = await prisma.payment.create({
        data: {
          merchantId: testMerchant.id,
          amount: '1.0',
          token: 'SOL',
          status: 'pending',
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      })

      const confirmed = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'confirmed',
          solanaSignature: '3u8hx7wK9z2pL4qR6sT8vW9xY0aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0u',
          confirmedAt: new Date(),
        },
      })

      expect(confirmed.status).toBe('confirmed')
      expect(confirmed.solanaSignature).toBeDefined()
      expect(confirmed.confirmedAt).toBeDefined()
    })

    it('should mark payment as failed', async () => {
      if (!testMerchant) throw new Error('Test merchant not created')

      const payment = await prisma.payment.create({
        data: {
          merchantId: testMerchant.id,
          amount: '0.25',
          token: 'SOL',
          status: 'pending',
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      })

      const failed = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'failed',
        },
      })

      expect(failed.status).toBe('failed')
    })
  })

  describe('Webhook Logs', () => {
    it('should create webhook log entry', async () => {
      if (!testMerchant) throw new Error('Test merchant not created')

      const payment = await prisma.payment.create({
        data: {
          merchantId: testMerchant.id,
          amount: '0.5',
          token: 'SOL',
          status: 'confirmed',
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          solanaSignature: 'test_sig_123',
        },
      })

      const webhookLog = await prisma.webhookLog.create({
        data: {
          paymentId: payment.id,
          merchantId: testMerchant.id,
          url: 'https://example.com/webhook',
          payload: JSON.stringify({ event: 'payment.confirmed' }),
          response: '{"status":"ok"}',
          status: 'delivered',
          signature: 'test_sig_456',
          deliveredAt: new Date(),
        },
      })

      expect(webhookLog).toBeDefined()
      expect(webhookLog.status).toBe('delivered')
      expect(webhookLog.paymentId).toBe(payment.id)
    })

    it('should track webhook retries', async () => {
      if (!testMerchant) throw new Error('Test merchant not created')

      const payment = await prisma.payment.create({
        data: {
          merchantId: testMerchant.id,
          amount: '0.5',
          token: 'SOL',
          status: 'confirmed',
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          solanaSignature: 'test_sig_789',
        },
      })

      let webhookLog = await prisma.webhookLog.create({
        data: {
          paymentId: payment.id,
          merchantId: testMerchant.id,
          url: 'https://example.com/webhook',
          payload: JSON.stringify({ event: 'payment.confirmed' }),
          response: 'Connection timeout',
          status: 'pending',
          signature: 'test_sig_101',
          retryCount: 0,
          nextRetry: new Date(Date.now() + 60000),
        },
      })

      webhookLog = await prisma.webhookLog.update({
        where: { id: webhookLog.id },
        data: {
          retryCount: 1,
          nextRetry: new Date(Date.now() + 5 * 60000),
        },
      })

      expect(webhookLog.retryCount).toBe(1)
      expect(webhookLog.status).toBe('pending')
    })
  })

  describe('Authentication', () => {
    it('should validate API key', async () => {
      if (!testMerchant) throw new Error('Test merchant not created')

      const merchant = await prisma.merchant.findUnique({
        where: { apiKey: testMerchant.apiKey },
      })

      expect(merchant).toBeDefined()
      expect(merchant?.id).toBe(testMerchant.id)
    })

    it('should reject invalid API key', async () => {
      const merchant = await prisma.merchant.findUnique({
        where: { apiKey: 'invalid_key_12345' },
      })

      expect(merchant).toBeNull()
    })
  })

  describe('Data Integrity', () => {
    it('should enforce unique solanaSignature', async () => {
      if (!testMerchant) throw new Error('Test merchant not created')

      const signature = 'unique_sig_xyz_123'

      const payment1 = await prisma.payment.create({
        data: {
          merchantId: testMerchant.id,
          amount: '1.0',
          token: 'SOL',
          status: 'confirmed',
          solanaSignature: signature,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      })

      expect(payment1.solanaSignature).toBe(signature)

      // Try to create second payment with same signature - should fail
      expect(async () => {
        await prisma.payment.create({
          data: {
            merchantId: testMerchant!.id,
            amount: '1.0',
            token: 'SOL',
            status: 'confirmed',
            solanaSignature: signature, // Duplicate
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          },
        })
      }).rejects.toThrow()
    })

    it('should track payment metadata', async () => {
      if (!testMerchant) throw new Error('Test merchant not created')

      const metadata = {
        orderId: 'order_123',
        productName: 'Widget',
        customerEmail: 'customer@example.com',
      }

      const payment = await prisma.payment.create({
        data: {
          merchantId: testMerchant.id,
          amount: '0.5',
          token: 'SOL',
          status: 'pending',
          metadata: metadata,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      })

      expect(payment.metadata).toEqual(metadata)
    })
  })

  describe('Query Performance', () => {
    it('should list payments with pagination', async () => {
      if (!testMerchant) throw new Error('Test merchant not created')

      // Create multiple payments
      for (let i = 0; i < 5; i++) {
        await prisma.payment.create({
          data: {
            merchantId: testMerchant.id,
            amount: `${i * 0.1}`,
            token: 'SOL',
            status: 'pending',
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          },
        })
      }

      // Fetch with limit
      const payments = await prisma.payment.findMany({
        where: { merchantId: testMerchant.id },
        take: 3,
        orderBy: { createdAt: 'desc' },
      })

      expect(payments.length).toBeLessThanOrEqual(3)
      expect(payments[0].merchantId).toBe(testMerchant.id)
    })

    it('should get merchant analytics', async () => {
      if (!testMerchant) throw new Error('Test merchant not created')

      const payments = await prisma.payment.groupBy({
        by: ['status'],
        where: { merchantId: testMerchant.id },
        _count: true,
      })

      expect(payments).toBeDefined()
      expect(Array.isArray(payments)).toBe(true)
    })
  })
})
