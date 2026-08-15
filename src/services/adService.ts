/**
 * Ad placement abstraction.
 * Live AdMob is NOT wired yet — requires privacy policy URL + Play Console + AdMob account.
 * Call sites should keep working with this no-op implementation.
 */

export type AdPlacement = 'home_banner' | 'result_banner';

export type AdService = {
  isEnabled: () => boolean;
  /** Reserved for interstitial after successful save/share. */
  showInterstitialIfAppropriate: (placement: 'after_save' | 'after_share') => Promise<void>;
};

export const adService: AdService = {
  isEnabled: () => false,
  showInterstitialIfAppropriate: async () => {
    // No-op until AdMob is approved and configured.
  },
};
