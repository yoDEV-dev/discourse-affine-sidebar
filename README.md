# yoDEV Sidebar Links

A Discourse theme component that puts the yoDEV apps — **Workplace** and **worX** — at the top of the community sidebar, so readers can reach them without leaving for the homepage first.

## Features

- Adds Workplace and worX links, in that order, pinned above the core Community links
- Works with OIDC authentication (users logged into Discourse arrive already authenticated)
- Configurable URL, title, and icon per link
- worX can be switched off independently
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

## How It Works

Both links are added with `api.addCommunitySectionLink`, which appends them to the
Community section. Placement is then done in CSS: the section is made a flex column
and each item is given an `order` (`-100` for Workplace, `-99` for worX), which lifts
them above the core links and fixes their order relative to each other.

**Both links live in one component on purpose.** `order` is what decides position, so
two separate components would each pin themselves and their relative order would come
down to which stylesheet loaded last — a coin flip on every deploy. One component
owning both makes "worX sits below Workplace" a fact rather than a race.

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
