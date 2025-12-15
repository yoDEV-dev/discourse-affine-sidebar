# Discourse AFFiNE Sidebar

A Discourse theme component that adds an AFFiNE workspace link to the sidebar for seamless navigation.

## Features

- Adds a customizable link to AFFiNE in the Discourse sidebar
- Works with OIDC authentication (users logged into Discourse are automatically authenticated in AFFiNE)
- Configurable URL, title, and icon
- Option to show/hide for anonymous users

## Installation

1. Go to **Admin** → **Customize** → **Themes**
2. Click **Install** → **From a git repository**
3. Enter: `https://github.com/yoDEV-dev/discourse-affine-sidebar`
4. Click **Install**
5. Add the component to your active theme

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `affine_url` | `https://affine.yodev.dev` | URL to your AFFiNE instance |
| `affine_link_title` | `Workspace` | Text shown in the sidebar |
| `affine_link_icon` | `cube` | Font Awesome icon name |
| `show_for_anon` | `false` | Show link for anonymous users |

## Requirements

- Discourse 3.0.0 or higher
- AFFiNE instance with OIDC authentication configured

## How It Works

When a user clicks the sidebar link:
1. If already authenticated via OIDC, they go directly to AFFiNE
2. If not authenticated, the OIDC flow redirects them through Discourse login first

This creates a seamless experience for users already logged into your Discourse community.

## Related

- [discourse-oidc-bridge](https://github.com/yoDEV-dev/discourse-oidc-bridge) - OIDC middleware for Discourse SSO

## License

MIT
