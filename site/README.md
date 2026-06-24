# Sharing Is Caring site

This directory is the editable source for the Sharing Is Caring GitHub Pages site. It deliberately has no build step or package dependencies.

## Update sessions

Edit [`data/sessions.csv`](data/sessions.csv). Each enabled row is rendered as a session card. Use `true` or `false` in the `enabled` column to publish or hide a session without touching HTML.

## Update recognition badges

The recognition page reads [`data/badges.json`](data/badges.json). `featured: true` selects the badge in the featured panel; otherwise the newest badge is used. The eventual Credly sync workflow should update this file, not the page markup.

## Preview

Serve the repository with any static HTTP server and open `/site/`. Browser `file://` URLs do not allow the page to load its CSV/JSON data.
