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

The popup sends GA4 `view_promotion`, `select_promotion`, and
`close_promotion` events through the site's existing Google Analytics tags.
Events include the promotion name, display location or close method, and time
spent in the popup. To review them, open GA4 Reports or DebugView and filter
for those event names.
