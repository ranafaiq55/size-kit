/**
 * Simple entitlement stub for a future one-time Pro purchase.
 * Do not add subscriptions without product-owner approval.
 */
export type UserEntitlements = {
  isPro: boolean;
};

export function getUserEntitlements(): UserEntitlements {
  return { isPro: false };
}
