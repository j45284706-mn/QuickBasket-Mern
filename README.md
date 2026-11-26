# QuickBasket — Q3
Requires Node.js 18+ and MongoDB replica set (or Atlas), because standalone MongoDB does not support multi-document transactions. Use a disposable development database for tests.

1. Run `npm install`.
2. Copy `.env.example` to `.env`, set MONGO_URI, JWT_SECRET (at least 24 characters), ADMIN_EMAIL and ADMIN_PASSWORD. Never commit .env. For local MongoDB, start mongod with `--replSet rs0` and initialize once with `mongosh --eval 'rs.initiate()'`.
3. `npm start`, open http://localhost:3000. Sign in as configured admin, create products. Register a customer and sign in to shop.
4. In another terminal run `npm test` while server is running. Tests create disposable users/products/orders and verify repeated checkout, prices, rollback, cancel and free shipping.

Personal rule N=986: shipping 1036; free at subtotal >=1986. Cart quantities are absolute values in PUT requests. Admin is provisioned through environment variables; public registration cannot assign Admin. Checkout and cancellation use MongoDB transactions; idempotency index is scoped to user and key. Client retains pending key in session storage for retries within the same login session.

Evidence to finish: Run tests and capture real stdout in report. Capture cart and order screenshots. Record <=3 min showing add, checkout, repeated-key test, low stock failure and cancellation. Add Q3.mp4 in Screen Recordings. Push repository to your GitHub and add link in SUBMISSION.txt; review and make genuine incremental commits as you work. Existing commits record preparation, not 20-minute exam activity. Do not submit until verified. This project has only had Node syntax checks here, not database integration testing.

## Provenance and review
This is an AI-assisted adaptation of a shared starter, not independent completed examination evidence. Junaid must review, adapt and understand it, disclose reuse as appropriate, and record his own genuine development history, tests and screenshots. Do not use Hamza’s recordings, database or repository.
