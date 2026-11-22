# Updating the Riff's sale popup

The popup always works with the built-in placeholder banner. To start or
replace a sale, put an image named **`sale-banner`** in this folder. Supported
extensions, in priority order, are `.avif`, `.webp`, `.png`, `.jpg`, `.jpeg`,
`.svg`, and `.gif`. For example: `sale-banner.webp`. If you upload more than
one version, the site uses the first valid image in that priority order. Use
lowercase extensions so the file is found on case-sensitive hosting.

The popup uses the image itself as the promotion content, so put any offer
details and expiry date directly on the artwork. Use a clear, high-resolution
image with large, high-contrast readable text and leave a little space around
its edges. Make sure shoppers can confirm offer terms with their local store.
Portrait, square, and landscape artwork are supported and scaled to fit desktop
and mobile screens without cropping. Static artwork is preferred; avoid flashing
or rapidly animated GIFs.

Once the image is uploaded with the site update, it replaces the placeholder.
The popup opens on every page load or reload. Closing it keeps it closed until
the next reload; Sale buttons in the desktop header and mobile navigation can
reopen it at any time. Replacing the file updates the image without a code
change. To end a sale, remove every `sale-banner.*` image from this folder; the
placeholder banner will show again.

## Black Friday homepage hero (separate from the popup)

`black-friday.png` is **not** a sale banner. It powers the dedicated Black
Friday hero at the top of the homepage, which replaces the normal hero from
November 1 to November 30, 2026 (sale runs November 23–30), then switches
back automatically. Keep
uploading daily `sale-banner.*` images as usual; they continue to appear in
the popup and do not affect the hero.

The hero uses optimized copies, `black-friday-640.jpg` and
`black-friday-1059.jpg`; the original PNG is linked as "Open full size". If
the flyer artwork changes, replace all three files. The dates and daily deals
in the hero are written in `index.html` (search for `BLACK FRIDAY HERO`). To
preview the hero outside those dates, add `?bf=preview` to the page URL.

The countdown runs on its own: before the sale it counts down to Monday,
November 23; each sale day it counts down to midnight and shows that day's
deal; on Cyber Monday (November 30) it reads "Last day!". To check any
moment, add both parameters, for example
`?bf=preview&bf-now=2026-11-25T14:30`.

### Black Friday SEO: undo after November 30

The hero hides itself after the sale, but the search and social settings stay
in `index.html` until someone removes them. Search for `BLACK FRIDAY 2026` and:

1. Restore the evergreen `<title>` and meta description (kept in the comment
   above them), plus the Open Graph and Twitter title, description and image.
2. Remove the flyer `<link rel="preload">`.
3. Remove the `SaleEvent` block and the four Black Friday questions from the
   `FAQPage` structured data, and the matching four questions in the visible
   FAQ section. Restore the evergreen `WebPage` name and description.
4. Set `sitemap.xml` `changefreq` back to `weekly` and update `lastmod`.

The popup sends GA4 `view_promotion`, `select_promotion`, and
`close_promotion` events through the site's existing Google Analytics tags.
Events include the promotion name, display location or close method, and time
spent in the popup. To review them, open GA4 Reports or DebugView and filter
for those event names.
