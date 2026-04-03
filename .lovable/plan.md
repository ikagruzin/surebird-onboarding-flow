

## Trustpilot Reviews — Use Real SVG Assets

### What changes

Replace the hand-coded Trustpilot stars, logo, and score in the review carousel with the real uploaded SVG assets. Update review count and make it a clickable link.

### Assets to copy into `src/assets/`

| Source | Destination | Usage |
|--------|-------------|-------|
| `user-uploads://star.svg` | `src/assets/trustpilot-star.svg` | Individual star in review cards |
| `user-uploads://Logo_trustpilot.svg` | `src/assets/trustpilot-logo.svg` (overwrite existing) | Logo in overview card header |
| `user-uploads://Review_Score.svg` | `src/assets/trustpilot-score.svg` | Large "4.6" score with stars in overview card |

### Changes in `step-offer.tsx`

**1. Replace `TrustpilotStars` component** (lines 489-501):
Instead of rendering lucide `Star` icons inside colored divs, render `<img src={trustpilotStar} />` repeated per star count. For unfilled stars, apply a grayscale/opacity filter or skip rendering (the star.svg is already the green Trustpilot square style).

**2. Trustpilot overview card** (lines 533-544):
- Replace the `<Star>` icon + "Trustpilot" text with `<img src={trustpilotLogo} />` (the full logo SVG)
- Replace the `<span>4.2</span>` + `<TrustpilotStars count={4}>` block with `<img src={trustpilotScore} />` (the score SVG already contains "4.6", the star row, and "Excellent" text)
- Change `"2,466 Trustpilot reviews"` to a clickable `<a>` tag: `"123 reviews"` linking to `https://nl.trustpilot.com/review/surebird.nl?utm_medium=trustbox&utm_source=MicroReviewCount` with `target="_blank" rel="noopener noreferrer"`

**3. Individual review cards** (lines 553-555):
- Replace `<TrustpilotStars count={review.rating} />` with a row of `<img src={trustpilotStar} />` images (one per rating point), keeping the `{review.rating}.0` text label

### File changes

| File | Change |
|------|--------|
| `src/assets/trustpilot-star.svg` | New — copy from upload |
| `src/assets/trustpilot-logo.svg` | Overwrite with new upload |
| `src/assets/trustpilot-score.svg` | New — copy from upload |
| `src/components/onboarding/step-offer.tsx` | Import new SVG assets. Replace `TrustpilotStars` to use real star SVG. Replace overview card header/score with logo and score SVGs. Change review count to "123 reviews" as clickable link. |

