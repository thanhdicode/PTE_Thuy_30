---
name: payment-vietnam
description: "Integrate VNPay, MoMo, and ZaloPay payment gateways for Vietnam: build payment URLs/QRs, handle callbacks/IPNs, verify signatures, query status, and process refunds. Use whenever implementing, debugging, or auditing payment flows in a Vietnamese full-stack application."
argument-hint: "[gateway|action]"
model: sonnet
allowed-tools:
  - read
  - grep
  - exec
  - web_search
  - web_get_contents
triggers:
  - user
  - model
---

# Payment Vietnam (VNPay / MoMo / ZaloPay)

> **Quick Guide:** All payment signatures MUST be computed server-side. The frontend receives only redirect URLs, QR data, or deep-link URLs. Always verify gateway callbacks/IPNs with HMAC signatures and match the returned amount/orderId to your persisted order before updating status. Use `vnpay` for VNPay; use raw HTTPS + `node:crypto` for MoMo v2 and ZaloPay (or the verified `momo-sdk` / `zalopay-sdk` packages). Never commit secrets.

---

<critical_requirements>

## CRITICAL: Before Using This Skill

> All code must follow project conventions in `CLAUDE.md` (kebab-case, named exports, import ordering, `import type`, named constants).

**(You MUST compute all signatures and store all secrets on the server — never expose `vnp_SecureSecret`, MoMo `secretKey`, or ZaloPay `key1`/`key2` to the frontend)**

**(You MUST verify webhook/callback signatures before trusting any payment status update)**

**(You MUST persist a unique `orderId` / `vnp_TxnRef` / `app_trans_id` with idempotency and order-state checks before calling the gateway)**

**(You MUST store raw callback payloads and signatures for at least 90 days for dispute and audit)**

**(You MUST use HTTPS return/callback URLs in production — VNPay, MoMo, and ZaloPay reject or downgrade non-HTTPS callbacks)**

**(You MUST reconcile returned amount with the stored order amount, accounting for VNPay's `*100` unit convention)**

</critical_requirements>

---

**Auto-detection:** VNPay, vnpay, MoMo, momo-sdk, ZaloPay, zalopay, payment gateway, thanh toán, callback, IPN, webhook, verify signature, QR pay, refund

**When to use:**

- Building payment creation, redirect, or QR flows for Vietnamese users
- Implementing or debugging VNPay/MoMo/ZaloPay callbacks
- Verifying payment signatures and handling disputes
- Querying transaction status or processing refunds

**When NOT to use:**

- Non-Vietnam payment providers (Stripe, PayPal, etc.)
- Purely frontend UI without server-side verification
- Cryptocurrency or bank-transfer flows not covered by these gateways

---

<philosophy>

## Philosophy

Vietnamese payment gateways share one hard rule: **the merchant server is the only trusted party**. Gateways send payment results back via redirect or asynchronous callback; attackers can forge both. Correct integration means:

1. **Server-side signing** — secrets never leave the server.
2. **Defense in depth** — verify signature, then verify `amount` + `orderId`, then check idempotency/state.
3. **Audit everything** — persist raw payloads, computed signatures, and order-state transitions.
4. **Async reconciliation** — callbacks can be missed; always provide query-status fallbacks.

</philosophy>

---

<patterns>

## Core Patterns

### Pattern 1: Centralized Gateway Configuration from Environment

Create one config module per gateway and validate required secrets at startup.

```typescript
// lib/payment/vnpay.config.ts
import { VNPay } from 'vnpay';
import { HashAlgorithm } from 'vnpay/enums';

export const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE!,
  secureSecret: process.env.VNPAY_SECURE_SECRET!,
  vnpayHost: process.env.VNPAY_HOST ?? 'https://sandbox.vnpayment.vn',
  testMode: process.env.NODE_ENV !== 'production',
  hashAlgorithm: HashAlgorithm.SHA512,
});
```

```typescript
// lib/payment/momo.config.ts
import { MomoClient } from 'momo-sdk'; // MIT, server-side only

export const momo = new MomoClient({
  partnerCode: process.env.MOMO_PARTNER_CODE!,
  accessKey: process.env.MOMO_ACCESS_KEY!,
  secretKey: process.env.MOMO_SECRET_KEY!,
  env: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
});
```

```typescript
// lib/payment/zalopay.config.ts
export const zalopayConfig = {
  appId: Number(process.env.ZALOPAY_APP_ID!),
  key1: process.env.ZALOPAY_KEY1!,
  key2: process.env.ZALOPAY_KEY2!,
  callbackUrl: process.env.ZALOPAY_CALLBACK_URL!,
  baseUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://payment.zalopay.vn'
      : 'https://sb-openapi.zalopay.vn',
};
```

**Why good:** Secrets are loaded once at startup; explicit `!` makes missing env vars fail fast; testMode toggles host.

---

### Pattern 2: VNPay — Build Payment URL and Verify Return/IPN

Use the official-style `vnpay` package for building URLs and signature verification.

```typescript
import { vnpay } from './vnpay.config';
import { ProductCode } from 'vnpay/enums';

export function createVNPayOrder(orderId: string, amountVnd: number, ip: string) {
  const paymentUrl = vnpay.buildPaymentUrl({
    vnp_Amount: amountVnd, // package multiplies by 100 internally
    vnp_IpAddr: ip,
    vnp_ReturnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/vnpay/callback`,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `PTE Talents order ${orderId}`,
    vnp_OrderType: ProductCode.Other,
  });
  return paymentUrl;
}
```

Verify return URL or IPN:

```typescript
import { vnpay } from './vnpay.config';

export function verifyVNPayCallback(query: Record<string, unknown>) {
  const verified = vnpay.verifyReturnUrl(query as any);
  if (!verified.isVerified) {
    throw new Error('VNPay signature mismatch');
  }
  if (!verified.isSuccess) {
    throw new Error(`VNPay payment failed: ${verified.message}`);
  }
  return { orderId: verified.vnp_TxnRef, amount: verified.vnp_Amount };
}
```

**Why good:** The package handles the `*100` amount conversion, GMT+7 create date, and HMAC signing. Verification returns parsed fields and signature status.

---

### Pattern 3: MoMo v2 — Create Payment (Raw or SDK)

For full control, sign with `node:crypto` using the documented field order. If using `momo-sdk`, the SDK handles the same fields.

```typescript
import crypto from 'node:crypto';

const MOMO_BASE =
  process.env.NODE_ENV === 'production'
    ? 'https://payment.momo.vn'
    : 'https://test-payment.momo.vn';

function signMomo(rawSignature: string, secretKey: string) {
  return crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');
}

export async function createMomoOrder(
  orderId: string,
  amount: number,
  orderInfo: string,
) {
  const requestId = `momo-${orderId}-${Date.now()}`;
  const payload = {
    partnerCode: process.env.MOMO_PARTNER_CODE!,
    accessKey: process.env.MOMO_ACCESS_KEY!,
    requestId,
    amount: amount.toString(),
    orderId,
    orderInfo,
    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/momo/callback`,
    ipnUrl: `${process.env.APP_URL}/api/payments/momo/ipn`,
    requestType: 'captureWallet',
    extraData: '',
    lang: 'vi',
  };

  const rawSignature = [
    'accessKey', payload.accessKey,
    'amount', payload.amount,
    'extraData', payload.extraData,
    'ipnUrl', payload.ipnUrl,
    'orderId', payload.orderId,
    'orderInfo', payload.orderInfo,
    'partnerCode', payload.partnerCode,
    'redirectUrl', payload.redirectUrl,
    'requestId', payload.requestId,
    'requestType', payload.requestType,
  ].join('=');

  const signature = signMomo(rawSignature, process.env.MOMO_SECRET_KEY!);

  const res = await fetch(`${MOMO_BASE}/v2/gateway/api/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, signature }),
  });

  const data = (await res.json()) as { resultCode: number; payUrl?: string };
  if (data.resultCode !== 0) throw new Error(`MoMo create failed: ${JSON.stringify(data)}`);
  return { requestId, payUrl: data.payUrl! };
}
```

**Why good:** Strict field ordering prevents silent signature failures; `requestId` includes order and timestamp for idempotency; `ipnUrl` is separate from `redirectUrl`.

---

### Pattern 4: ZaloPay — Create Order and Verify Callback

ZaloPay uses `app_trans_id` formatted as `yymmdd_<id>`, `app_time` as epoch ms, and HMAC-SHA256 with `key1` for request signing; callback verification uses `key2`.

```typescript
import crypto from 'node:crypto';

const ZALOPAY_BASE =
  process.env.NODE_ENV === 'production'
    ? 'https://openapi.zalopay.vn/v2'
    : 'https://sb-openapi.zalopay.vn/v2';

function zaloMac(data: Record<string, unknown>, key: string) {
  const message = Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  return crypto.createHmac('sha256', key).update(message).digest('hex');
}

export async function createZaloPayOrder(
  orderId: string,
  amount: number,
  description: string,
  appUser: string,
) {
  const appTransId = `${new Date().toISOString().slice(2, 10).replace(/-/g, '')}_${orderId}`;
  const appTime = Date.now();
  const embedData = JSON.stringify({ promotioninfo: '', merchantinfo: orderId });
  const item = JSON.stringify([{ item_name: 'PTE course', item_price: amount, item_quantity: 1 }]);

  const body = {
    app_id: Number(process.env.ZALOPAY_APP_ID!),
    app_trans_id: appTransId,
    app_user: appUser,
    app_time: appTime,
    amount,
    item,
    embed_data: embedData,
    description,
    callback_url: process.env.ZALOPAY_CALLBACK_URL!,
    bank_code: '',
  };

  const macFields = {
    app_id: body.app_id,
    app_trans_id: body.app_trans_id,
    app_user: body.app_user,
    app_time: body.app_time,
    amount: body.amount,
    embed_data: body.embed_data,
    item: body.item,
  };

  const mac = zaloMac(macFields, process.env.ZALOPAY_KEY1!);

  const res = await fetch(`${ZALOPAY_BASE}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ ...body, mac } as any),
  });

  const data = (await res.json()) as { return_code: number; order_url?: string; zp_trans_id?: string };
  if (data.return_code !== 1) throw new Error(`ZaloPay create failed: ${JSON.stringify(data)}`);
  return { appTransId, orderUrl: data.order_url! };
}

export function verifyZaloPayCallback(payload: { data: string; mac: string }) {
  const computed = crypto
    .createHmac('sha256', process.env.ZALOPAY_KEY2!)
    .update(payload.data)
    .digest('hex');

  if (computed !== payload.mac) {
    throw new Error('ZaloPay callback signature mismatch');
  }

  const data = JSON.parse(payload.data) as { app_trans_id: string; amount: number; zp_trans_id: string };
  return data;
}
```

**Why good:** `key1` signs the request; `key2` verifies the callback, avoiding key reuse. `app_trans_id` embeds Vietnam date (`yymmdd`) per ZaloPay requirement.

---

### Pattern 5: Webhook / Callback Handler Skeleton

All three gateways must follow the same defensive handler shape.

```typescript
export async function handlePaymentCallback(
  gateway: 'vnpay' | 'momo' | 'zalopay',
  rawPayload: unknown,
  rawSignature?: string,
) {
  // 1. Store raw payload + signature for audit
  await auditLog.create({ gateway, payload: JSON.stringify(rawPayload), signature: rawSignature });

  // 2. Verify signature (gateway-specific)
  let result: { orderId: string; amount: number; gatewayTransId: string };
  if (gateway === 'vnpay') {
    const verified = vnpay.verifyReturnUrl(rawPayload as any);
    if (!verified.isVerified) throw new Error('VNPay signature invalid');
    result = { orderId: verified.vnp_TxnRef as string, amount: verified.vnp_Amount as number, gatewayTransId: verified.vnp_TransactionNo as string };
  } else if (gateway === 'momo') {
    const valid = momo.verifyWebhookSignature(rawPayload as any); // using momo-sdk
    if (!valid) throw new Error('MoMo signature invalid');
    const p = rawPayload as { orderId: string; amount: string; transId: string };
    result = { orderId: p.orderId, amount: Number(p.amount), gatewayTransId: p.transId };
  } else {
    const p = rawPayload as { data: string; mac: string };
    const data = verifyZaloPayCallback(p);
    result = { orderId: data.app_trans_id, amount: data.amount, gatewayTransId: data.zp_trans_id };
  }

  // 3. Idempotency + order state check
  const order = await orderRepository.findById(result.orderId);
  if (!order) throw new Error('Order not found');
  if (order.amount !== result.amount) throw new Error(`Amount mismatch: ${order.amount} vs ${result.amount}`);
  if (order.status !== 'PENDING') return { alreadyProcessed: true };

  // 4. Update order (inside transaction)
  await db.transaction(async (tx) => {
    await orderRepository.updateStatus(tx, result.orderId, 'PAID', {
      gateway,
      gatewayTransId: result.gatewayTransId,
    });
  });

  return { success: true };
}
```

**Why good:** Signature verification, idempotency, amount matching, and order-state guard are applied uniformly before any status update.

---

### Pattern 6: Idempotency and Order State Machine

```typescript
type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

// On payment creation
export async function initiateOrder(order: { id: string; amount: number; userId: string }) {
  await orderRepository.insert({ ...order, status: 'PENDING', attempt: 0 });
  // Only call gateway AFTER persistence
  return createVNPayOrder(order.id, order.amount, '127.0.0.1');
}

// Idempotent status update
export async function markPaid(orderId: string, gatewayTransId: string) {
  return orderRepository.updateWhere(
    { id: orderId, status: 'PENDING' },
    { status: 'PAID', gatewayTransId, paidAt: new Date() },
  );
}
```

**Why good:** `PENDING` status acts as a lock; concurrent callbacks cannot double-charge.

---

### Pattern 7: Query Status and Refund

Always provide a fallback to query gateway status when a callback is missed.

```typescript
// VNPay queryDR
const dr = await vnpay.queryDr({
  vnp_TxnRef: orderId,
  vnp_TransactionDate: dateFormat(new Date(order.createdAt), 'yyyyMMdd'),
  vnp_CreateDate: dateFormat(new Date(), 'yyyyMMddHHmmss'),
  vnp_IpAddr: '127.0.0.1',
});

// MoMo query
const momoQuery = await momo.queryTransaction({ orderId });

// ZaloPay query
const zaloQuery = await fetch(`${ZALOPAY_BASE}/query`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ app_id: process.env.ZALOPAY_APP_ID!, app_trans_id: appTransId, mac: zaloMac({ app_id, app_trans_id }, key1) }),
});
```

**Why good:** Scheduled jobs or admin endpoints can reconcile missed callbacks.

</patterns>

---

<decision_framework>

## Decision Framework

### Which Gateway to Recommend

```
Need fastest integration with TypeScript types? -> VNPay (vnpay package)
Need wallet-app deep link / pay by MoMo app?   -> MoMo
Need QR/VietQR + in-app web payment?            -> ZaloPay
High-value recurring/subscription?              -> Check gateway T&Cs; usually not supported natively
```

### When to Use the SDK vs Raw HTTP

```
VNPay -> Prefer `vnpay` or `nestjs-vnpay` (battle-tested, MIT)
MoMo  -> Prefer `momo-sdk` for v2; raw HMAC is acceptable if you audit field order
ZaloPay -> Prefer official docs + raw crypto; verify any third-party SDK license before depending on it
```

</decision_framework>

---

<red_flags>

## RED FLAGS

**High Priority Issues:**

- Sending secret keys or signature computation to the browser/frontend
- Updating order status before signature verification
- Accepting a callback without checking `amount` and `orderId` against persisted order
- Using the same `key1`/`key2` for both request signing and callback verification (ZaloPay)
- Not handling VNPay's `*100` amount unit, causing under/over-charge
- Skipping idempotency and allowing double-fulfilment on retry

**Medium Priority Issues:**

- No raw payload audit log
- Hardcoded sandbox hosts or test keys in production
- Missing timeout/retry on gateway API calls
- Not providing a query-status fallback for missed callbacks

**Common Mistakes:**

- Confusing MoMo `requestId` with `orderId` — `requestId` should be unique per API call
- Forgetting ZaloPay `app_trans_id` must start with Vietnam `yymmdd`
- Sorting parameters alphabetically instead of using the gateway's exact field order
- Trusting `resultCode === 0` or `return_code === 1` without signature verification

</red_flags>

---

<critical_reminders>

## CRITICAL REMINDERS

> All code must follow project conventions in `CLAUDE.md` (kebab-case, named exports, import ordering, `import type`, named constants).

**(You MUST compute all signatures and store all secrets on the server — never expose `vnp_SecureSecret`, MoMo `secretKey`, or ZaloPay `key1`/`key2` to the frontend)**

**(You MUST verify webhook/callback signatures before trusting any payment status update)**

**(You MUST persist a unique `orderId` / `vnp_TxnRef` / `app_trans_id` with idempotency and order-state checks before calling the gateway)**

**(You MUST store raw callback payloads and signatures for at least 90 days for dispute and audit)**

**(You MUST use HTTPS return/callback URLs in production)**

**Failure to follow these rules will lead to forged payments, duplicate fulfilment, and regulatory audit failures.**

</critical_reminders>
