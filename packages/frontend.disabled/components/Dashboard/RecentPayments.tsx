'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Common/Card'
import { Badge } from '@/components/Common/Badge'
import { Button } from '@/components/Common/Button'
import { EmptyState } from '@/components/Common/EmptyState'
import { Spinner } from '@/components/Common/Spinner'
import { useApi } from '@/hooks/useApi'
import { useMerchant } from '@/hooks/useMerchant'
import { formatters } from '@/utils/formatting'
import { PaymentListResponse, Payment } from '@/types'

export interface RecentPaymentsProps {
  title?: string
}

export const RecentPayments: React.FC<RecentPaymentsProps> = ({
  title = 'Recent Payments',
}) => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState(0)
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date')
  const { execute, loading } = useApi<PaymentListResponse>()
  const { apiKey } = useMerchant()

  const limit = 10

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await execute(
          `/api/payments/list?limit=${limit}&offset=${offset}&sortBy=${sortBy}`,
          {
            method: 'GET',
            apiKey: apiKey || undefined,
          }
        )

        setPayments(response.payments)
        setTotal(response.total)
      } catch (err) {
        console.error('Failed to fetch payments:', err)
      }
    }

    if (apiKey) {
      fetchPayments()
    }
  }, [offset, sortBy, apiKey, execute, limit])

  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(total / limit)

  const getStatusVariant = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
      case 'confirmed':
        return 'success'
      case 'pending':
        return 'info'
      case 'failed':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: Payment['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>Total: {total} payments</CardDescription>
          </div>
          <div className="flex gap-1">
            {(['date', 'amount', 'status'] as const).map((sort) => (
              <Button
                key={sort}
                onClick={() => setSortBy(sort)}
                variant={sortBy === sort ? 'primary' : 'secondary'}
                size="sm"
              >
                {sort === 'date' ? 'Date' : sort === 'amount' ? 'Amount' : 'Status'}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : payments.length > 0 ? (
          <div className="space-y-4">
            {/* Table header */}
            <div className="hidden grid-cols-6 gap-4 border-b border-gray-200 pb-3 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300 sm:grid">
              <div>ID</div>
              <div>Amount</div>
              <div>Token</div>
              <div>Status</div>
              <div>Date</div>
              <div>Action</div>
            </div>

            {/* Table rows */}
            <div className="space-y-2">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-col gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700 sm:grid sm:grid-cols-6 sm:gap-4 sm:border-0 sm:border-b sm:p-3 sm:last:border-0"
                >
                  <div className="truncate font-mono text-sm font-medium text-gray-900 dark:text-white sm:col-span-1">
                    <span className="sm:hidden">ID: </span>
                    {formatters.formatPaymentId(payment.id)}
                  </div>

                  <div className="font-semibold text-gray-900 dark:text-white sm:col-span-1">
                    <span className="sm:hidden">Amount: </span>
                    {formatters.formatCurrency(payment.amount, payment.token)}
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400 sm:col-span-1">
                    <span className="sm:hidden">Token: </span>
                    {payment.token}
                  </div>

                  <div className="sm:col-span-1">
                    <Badge variant={getStatusVariant(payment.status)} size="sm">
                      {getStatusLabel(payment.status)}
                    </Badge>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400 sm:col-span-1">
                    <span className="sm:hidden">Date: </span>
                    {formatters.formatDate(payment.createdAt)}
                  </div>

                  <div className="sm:col-span-1">
                    <a
                      href={`https://explorer.solana.com/tx/${payment.solanaSignature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setOffset(Math.max(0, offset - limit))}
                    variant="secondary"
                    size="sm"
                    disabled={offset === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setOffset(offset + limit)}
                    variant="secondary"
                    size="sm"
                    disabled={offset + limit >= total}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            title="No payments yet"
            description="Your payments will appear here"
          />
        )}
      </CardContent>
    </Card>
  )
}
