# yoDEV Sidebar Links

A Discourse theme component that puts the yoDEV apps — **Workplace**, **worX** and **Decisions** — at the top of the community sidebar, so readers can reach them without leaving for the homepage first. It also shows a dismissible **yoDEV Decisions** announcement on the community landing pages (YOD-659).

## Features

- Adds Workplace, worX and yoDEV Decisions links, in that order, pinned above the core Community links
- Decisions links to the Spanish edition (`/`) for every locale except English, which gets `/en`, and carries a small localized "Nuevo / New / Novo" badge that a setting removes
- A dismissible, localized Decisions banner on `/`, `/latest` and `/categories` only, with optional start/end dates
- Works with OIDC authentication (users logged into Discourse arrive already authenticated)
- Configurable URL, title, and icon per link
- worX, Decisions and the banner can each be switched off independently
- Optionally shown to anonymous visitors

## Installation

1. Go to **Admin** → **Customize** → **Components**
2. Click **Install** → **From a git repository**
3. Enter: `https://github.com/yoDEV-dev/discourse-affine-sidebar`
4. Click **Install**
5. Add the component to your active theme

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `affine_url` | `https://workplace.yodev.dev` | URL to your AFFiNE instance |
| `affine_link_title` | `yoDEV Workplace` | Text shown in the sidebar |
| `affine_link_icon` | `cube` | Font Awesome icon name |
| `show_for_anon` | `true` | Show the links to anonymous visitors |
| `worx_enabled` | `true` | Show the worX link |
| `worx_url` | `https://worx.yodev.dev` | URL to worX |
| `worx_link_title` | `yoDEV worX` | Text shown in the sidebar |
| `worx_link_icon` | `briefcase` | Font Awesome icon name |
| `decisions_enabled` | `true` | Show the yoDEV Decisions sidebar link |
| `decisions_url` | `https://decisions.yodev.dev/` | Decisions for every locale except English (Spanish edition). DEV: `https://staging-decisions.yodev.dev/` |
| `decisions_url_en` | `https://decisions.yodev.dev/en` | Decisions for English readers. DEV: `https://staging-decisions.yodev.dev/en` |
| `decisions_link_title` | `yoDEV Decisions` | Text shown in the sidebar (product name, not translated) |
| `decisions_link_icon` | `scale-balanced` | Font Awesome icon name |
| `decisions_new_badge` | `true` | Show the New / Nuevo / Novo badge on the sidebar link |
| `decisions_banner_enabled` | `true` | Show the Decisions banner on the landing pages |
| `decisions_banner_show_for_anon` | `true` | Also show the banner to anonymous visitors (independent of `show_for_anon`) |
| `decisions_banner_anchor` | `(blank — top of page)` | Fragment the banner's CTA lands on — the public results on the Decisions landing |
| `decisions_banner_start_date` | *(blank)* | Optional first day, `YYYY-MM-DD`, UTC, inclusive |
| `decisions_banner_end_date` | *(blank)* | Optional last day, `YYYY-MM-DD`, UTC, inclusive |
| `decisions_banner_version` | `1` | Dismissal is remembered per browser under this version; change it to re-show the banner |

Both Decisions URLs must be `https`; anything else renders no link rather than a broken one. A **malformed** date hides the banner rather than showing it forever.

## How It Works

All three links are added with `api.addCommunitySectionLink`, which appends them to the
Community section. Placement is then done in CSS: the section is made a flex column
and each item is given an `order` (`-102` Workplace, `-101` worX, `-100` Decisions),
which lifts them above the core links and fixes their order relative to each other.
The token calculator (`yodev-token-calculator-theme`) sits at `-98`, below all three.

YOD-659 moved Workplace and worX down from `-100`/`-99`: `order` is an integer, so there
was no slot between worX and the calculator, and renumbering this component's own links
keeps the change inside one repo.

**The links live in one component on purpose.** `order` is what decides position, so
two separate components would each pin themselves and their relative order would come
down to which stylesheet loaded last — a coin flip on every deploy. One component
owning both makes "worX sits below Workplace" a fact rather than a race.

### yoDEV Decisions banner (YOD-659)

A Glimmer component rendered in the `discovery-list-controls-above` plugin outlet, which
exists only on discovery routes, and narrowed further to `/`, `/latest` and `/categories`
— not category, tag or `/top` listings, and never a topic page. It follows SPA navigation
through the router's tracked `currentURL`, so it needs no history patching.

- **Not a Discourse banner topic.** It is theme markup only: it creates and edits no topic
  or post, calls no API, and sends no notification.
- **Dismissal** is stored per browser in `localStorage` (`yodev_decisions_banner_dismissed_v<version>`),
  every access wrapped in `try/catch`. If storage is blocked the banner still closes for
  that page view.
- **Copy** is in `locales/` (`es`, `en`, `pt`, `pt_BR`). The CTA goes to the public
  results on the Decisions landing, in the reader's language (Portuguese readers get the
  Spanish edition — there is no Portuguese one).
- **Accessibility:** a real `<a href>` CTA, a `<button type="button">` dismiss control with a
  localized `aria-label`, visible `:focus-visible` outlines, and white-on-tertiary CTA text
  (4.70:1 on the current dark theme, measured for the apex bridge).
- The copy names Jev and carries a one-line note that yoDEV Decisions is independent of
  TypeSafe AI. No TypeSafe marks are used.

Anonymous visitors on the landing page also see the site-wide launch-offer banner from
`discourse-yodev-beta-offer`. If the two together feel like too much, turn off
`decisions_banner_show_for_anon`.

**Why it lives here rather than in its own component:** it shares the Decisions URL
settings with the sidebar link (one place to repoint DEV at staging), and this component
is already installed and attached on both forums, so rollout is *Check for updates*
rather than a new install. It has its own enable toggle and date window, so it can retire
without touching the links.

### Icons

Discourse ships a *subset* of Font Awesome and renders nothing at all for an icon
outside it — no error, no fallback, just a missing glyph. The icons this component uses
are therefore declared in `about.json` under `modifiers.svg_icons`, which is the
supported way for a theme to force an icon into the subset. **If you change an icon
setting, add the new name there too.**

### Authentication

When a user clicks a link:

1. If already authenticated via OIDC, they go straight through.
2. If not, the OIDC flow sends them via Discourse login first.

An anonymous visitor clicking through lands on the homepage app selector rather than a
login form. That is deliberate — these hostnames appear on public marketing assets, and
an anonymous arrival is a prospect who should see the product, not a credential prompt.

## Related

- [discourse-oidc-bridge](https://github.com/yoDEV-dev/discourse-oidc-bridge) — OIDC middleware for Discourse SSO

## License

MIT
