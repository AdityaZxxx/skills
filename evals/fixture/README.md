# Orders

A small TypeScript service that takes orders, charges a card via Stripe,
ships them, and cancels them. Runs inside our billing worker. There is no
package.json and no build step on purpose: types matter, tooling does not.
