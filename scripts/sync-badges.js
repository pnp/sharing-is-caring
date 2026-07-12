#!/usr/bin/env node
// Fetches active badge templates from the Credly API, downloads images locally,
// and writes site/data/badges.json. Runs as a GitHub Action on a weekly schedule.
//
// Required env vars:
//   CREDLY_TOKEN   — secret SIC_CREDLY_BADGES (token is the Basic auth username)
//   CREDLY_ORG_ID  — repo variable CREDLY_ORG_ID

const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Load .env from repo root when running locally (no-op if file absent or vars already set)
const envFile = path.resolve(__dirname, '../.env');
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, 'utf8').split('\n').forEach((line) => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length && !process.env[key.trim()]) {
      process.env[key.trim()] = rest.join('=').trim();
    }
  });
}

const ORG_ID = process.env.CREDLY_ORG_ID;
const TOKEN = process.env.CREDLY_TOKEN;

if (!ORG_ID || !TOKEN) {
  console.error('Missing CREDLY_ORG_ID or CREDLY_TOKEN');
  process.exit(1);
}

const CURRENT_YEAR = new Date().getFullYear();
const BADGES_JSON = path.resolve(__dirname, '../data/badges.json');
const IMAGES_DIR = path.resolve(__dirname, '../assets/images/badges');

fs.mkdirSync(IMAGES_DIR, { recursive: true });

const AUTH = Buffer.from(`${TOKEN}:`).toString('base64');
const badgeNameSorter = new Intl.Collator('en', { sensitivity: 'base', numeric: true });
const NEW_BADGE_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function badgeDisplayName(name) {
  return name.replace(/\s*-\s*Microsoft 365 & Power Platform Community.*$/i, '').trim();
}

function badgePublishedMs(badge) {
  const publishedAt = badge.stateUpdatedAt || badge.createdAt;
  if (!publishedAt) return null;
  const publishedMs = new Date(publishedAt).getTime();
  return Number.isNaN(publishedMs) ? null : publishedMs;
}

function isNewBadge(badge, nowMs = Date.now()) {
  const publishedMs = badgePublishedMs(badge);
  return publishedMs !== null && nowMs - publishedMs <= NEW_BADGE_DAYS * MS_PER_DAY;
}

function get(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers: {
        Authorization: `Basic ${AUTH}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };
    https.get(options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return get(res.headers.location).then(resolve).catch(reject);
      }
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error(`JSON parse failed for ${url}: ${body.slice(0, 200)}`)); }
      });
    }).on('error', reject);
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const mod = parsed.protocol === 'https:' ? https : require('http');
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SIC-badge-sync/1.0)' },
    };
    mod.get(options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', (e) => { fs.unlink(dest, () => {}); reject(e); });
    }).on('error', reject);
  });
}

async function fetchAllTemplates() {
  const templates = [];
  let page = 1;
  while (true) {
    const url = `https://api.credly.com/v1/organizations/${ORG_ID}/badge_templates?filter[state]=active&per=50&page=${page}`;
    console.log(`Fetching page ${page}…`);
    const res = await get(url);
    const batch = res.data || [];
    templates.push(...batch);
    if (page >= (res.metadata?.total_pages || 1)) break;
    page++;
  }
  return templates;
}

async function main() {
  const all = await fetchAllTemplates();
  console.log(`${all.length} active badge templates total`);

  // Filter to current year; fall back to all active if none found
  let templates = all.filter((t) => new Date(t.created_at).getFullYear() === CURRENT_YEAR);
  if (templates.length === 0) {
    console.log(`No ${CURRENT_YEAR} badges found — using all active templates`);
    templates = all;
  } else {
    console.log(`${templates.length} badges from ${CURRENT_YEAR}`);
  }

  // Load existing JSON to preserve editorial badge settings.
  let existing = { badges: [] };
  try { existing = JSON.parse(fs.readFileSync(BADGES_JSON, 'utf8')); } catch {}
  const featuredIds = new Set(existing.badges.filter((b) => b.featured && !b.autoFeaturedNew).map((b) => b.id));
  const existingAutoFeaturedCount = existing.badges.filter((b) => b.autoFeaturedNew).length;
  const featuredOrders = new Map(
    existing.badges
      .filter((b) => Number.isFinite(b.featuredOrder) && !b.autoFeaturedNew)
      .map((b) => [b.id, Math.max(1, b.featuredOrder - existingAutoFeaturedCount)])
  );

  const badges = [];
  for (const t of templates) {
    const imageUrl = t.image?.url || t.image_url || null;
    let imagePath = null;

    if (imageUrl) {
      const ext = path.extname(new URL(imageUrl).pathname) || '.png';
      const filename = `${t.id}${ext}`;
      const dest = path.join(IMAGES_DIR, filename);
      // Skip download if file already exists (images don't change after creation)
      if (!fs.existsSync(dest)) {
        console.log(`  Downloading: ${t.name}`);
        try { await download(imageUrl, dest); }
        catch (e) { console.warn(`  Image download failed for ${t.name}: ${e.message}`); }
      }
      if (fs.existsSync(dest)) {
        // Path relative to the recognition page (one level deep from site root)
        imagePath = `../assets/images/badges/${filename}`;
      }
    }

    badges.push({
      id: t.id,
      name: t.name,
      description: t.description || '',
      url: t.url || t.public_url || `https://www.credly.com/org/m365pnp/badge/${t.id}`,
      image: imagePath,
      createdAt: t.created_at || null,
      updatedAt: t.updated_at || null,
      stateUpdatedAt: t.state_updated_at || null,
      featured: featuredIds.has(t.id),
      ...(featuredOrders.has(t.id) ? { featuredOrder: featuredOrders.get(t.id) } : {}),
    });
  }

  badges.sort((a, b) => badgeNameSorter.compare(badgeDisplayName(a.name), badgeDisplayName(b.name)));

  const newBadges = badges
    .filter((badge) => isNewBadge(badge))
    .sort((a, b) => badgePublishedMs(b) - badgePublishedMs(a));
  newBadges.forEach((badge, index) => {
    badge.featured = true;
    badge.featuredOrder = index + 1;
    badge.autoFeaturedNew = true;
  });

  const autoFeaturedIds = new Set(newBadges.map((badge) => badge.id));
  badges.forEach((badge) => {
    if (!badge.featured || autoFeaturedIds.has(badge.id) || !Number.isFinite(badge.featuredOrder)) return;
    badge.featuredOrder += newBadges.length;
  });

  // Ensure at least one badge is featured.
  if (badges.length > 0 && !badges.some((b) => b.featured)) badges[0].featured = true;

  const output = {
    updated: new Date().toISOString().split('T')[0],
    organizationUrl: `https://www.credly.com/organizations/m365pnp/badges`,
    badges,
  };

  fs.writeFileSync(BADGES_JSON, JSON.stringify(output, null, 2));
  console.log(`Wrote ${badges.length} badges to badges.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
