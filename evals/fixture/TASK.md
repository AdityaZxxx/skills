# Task: add refund support

The orders system needs refunds. A paid order can be refunded in full, or
partially by an amount in cents. A refund moves the money back through the
payment gateway and records the outcome on the order.

Business rules:

- A cancelled order cannot be refunded.
- An order already refunded in full cannot be refunded again.
- A partial refund cannot exceed the remaining refundable amount.
- Every refund attempt must be auditable: order id, amount, outcome, and
  the resulting order state.

Constraints:

- Unit tests for the refund rules must run without network access.
- The team will add a second payment provider next quarter; do not build
  for it speculatively, but the code should not fight it either.
- TypeScript, no frameworks. If you add tests, plain assert-style files are
  fine (no test runner required to exist).

Refactor the existing code where its current shape makes this hard to
build or test.
