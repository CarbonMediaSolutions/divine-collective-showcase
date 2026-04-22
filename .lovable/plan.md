

# Update Social Media Links in Footer

Replace the placeholder `#` hrefs in `src/components/Footer.tsx` with the real handles, and add a Facebook icon (currently missing).

## Links

| Platform | Handle | URL |
|---|---|---|
| Instagram | @thedivinecollective__ | https://instagram.com/thedivinecollective__ |
| TikTok | @the1divinecollective | https://tiktok.com/@the1divinecollective |
| YouTube | @The1DivineCollective | https://youtube.com/@The1DivineCollective |
| Facebook | @thedivinecollective__ | https://facebook.com/thedivinecollective__ |

## Changes to `src/components/Footer.tsx`
1. Set `href` on each existing social `<a>` (TikTok, Instagram, YouTube) to the URLs above, with `target="_blank"` and `rel="noopener noreferrer"`.
2. Add a new Facebook circle icon button after YouTube, matching the existing styling (same 8x8 circle, primary border, hover fill).

No other files affected.

