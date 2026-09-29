import test from 'node:test'
import assert from 'node:assert/strict'
import { decidePaymentOutcome, toCents } from './toyyibpay.js'

const order = {
  status: 'PENDING',
  billCode: 'abc123',
  externalRef: 'ord_123',
  totalCents: 4900
}

test('converts ringgit decimals and sen integers', () => {
  assert.equal(toCents('49.00'), 4900)
  assert.equal(toCents('49.5'), 4950)
  assert.equal(toCents('4900'), 4900)
  assert.equal(toCents('RM49'), null)
})

test('does not mark an order paid from the callback status alone', () => {
  const outcome = decidePaymentOutcome({
    order,
    callback: { status: '1', billcode: 'abc123', order_id: 'ord_123', refno: 'TP1' },
    transactions: []
  })
  assert.equal(outcome.action, 'pending')
})

test('marks paid only when ToyyibPay confirms the amount', () => {
  const outcome = decidePaymentOutcome({
    order,
    callback: { status: '1', billcode: 'abc123', order_id: 'ord_123', refno: 'TP1' },
    transactions: [{ billpaymentStatus: '1', billpaymentAmount: '49.00' }]
  })
  assert.equal(outcome.action, 'mark_paid')
  assert.equal(outcome.amountCents, 4900)
  assert.equal(outcome.refNo, 'TP1')
})

test('rejects a verified transaction when the amount does not match', () => {
  const outcome = decidePaymentOutcome({
    order,
    callback: { status: '1', billcode: 'abc123', order_id: 'ord_123' },
    transactions: [{ billpaymentStatus: 1, billpaymentAmount: '10.00' }]
  })
  assert.deepEqual(outcome, { action: 'reject', reason: 'amount_mismatch' })
})

test('rejects a callback for a different bill or reference', () => {
  assert.equal(decidePaymentOutcome({
    order,
    callback: { status: '1', billcode: 'other', order_id: 'ord_123' },
    transactions: [{ billpaymentStatus: '1', billpaymentAmount: '49.00' }]
  }).reason, 'billcode_mismatch')

  assert.equal(decidePaymentOutcome({
    order,
    callback: { status: '1', billcode: 'abc123', order_id: 'ord_other' },
    transactions: [{ billpaymentStatus: '1', billpaymentAmount: '49.00' }]
  }).reason, 'reference_mismatch')
})

test('asks for a retry when the verification API cannot be reached', () => {
  const outcome = decidePaymentOutcome({ order, callback: { status: '1' }, providerError: true })
  assert.equal(outcome.action, 'retry')
})

test('records a failure only when the gateway confirms there is no successful payment', () => {
  const outcome = decidePaymentOutcome({
    order,
    callback: { status: '3', billcode: 'abc123', order_id: 'ord_123', reason: 'Insufficient funds' },
    transactions: [{ billpaymentStatus: '3', billpaymentAmount: '49.00' }]
  })
  assert.equal(outcome.action, 'mark_failed')
})
