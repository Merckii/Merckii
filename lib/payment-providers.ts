// Stripe Integration
export async function createStripePaymentIntent(amount: number, currency = "usd") {
  // Mock Stripe payment intent for demo
  return {
    id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
    amount: Math.round(amount * 100), // Stripe uses cents
    currency,
    status: "requires_payment_method",
  }
}

// PayPal Integration
export async function createPayPalPayment(amount: number, currency = "USD") {
  // Mock PayPal payment for demo
  const orderId = `PAYPAL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  return {
    id: orderId,
    status: "CREATED",
    links: [
      {
        href: `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`,
        rel: "approve",
        method: "GET",
      },
    ],
  }
}

export async function capturePayPalPayment(orderId: string) {
  // Mock PayPal capture for demo
  return {
    id: `${orderId}_CAPTURED`,
    status: "COMPLETED",
    purchase_units: [
      {
        payments: {
          captures: [
            {
              id: `${orderId}_CAPTURE`,
              status: "COMPLETED",
            },
          ],
        },
      },
    ],
  }
}

// Binance Pay Integration
export async function createBinancePayment(amount: number, currency = "USDT") {
  // Mock Binance payment for demo
  const prepayId = `BINANCE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  return {
    status: "SUCCESS",
    data: {
      prepayId,
      checkoutUrl: `https://pay.binance.com/checkout/${prepayId}`,
      qrCodeUrl: `https://pay.binance.com/qr/${prepayId}`,
      deeplink: `binancepay://pay?prepayId=${prepayId}`,
    },
  }
}

export async function verifyBinancePayment(prepayId: string) {
  // Mock Binance verification for demo
  return {
    status: "SUCCESS",
    data: {
      transactionId: `${prepayId}_VERIFIED`,
      status: "PAID",
    },
  }
}
