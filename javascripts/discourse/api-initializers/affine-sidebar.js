import { apiInitializer } from "discourse/lib/api";
import { i18n } from "discourse-i18n";
import DecisionsBanner from "../components/decisions-banner";
import { decisionsUrl, safeHttpsUrl } from "../lib/decisions";

export default apiInitializer((api) => {
  const currentUser = api.getCurrentUser();

  // YOD-659: the Decisions banner lives on the discovery landing pages only
  // (see the component for exactly which). It has its own enable toggle and
  // its own anonymous switch, so it is registered before the sidebar's
  // `show_for_anon` early return below and is not governed by it.
  if (settings.decisions_banner_enabled) {
    api.renderInOutlet("discovery-list-controls-above", DecisionsBanner);
  }

  // Check if we should show the sidebar links for anonymous users
  if (!currentUser && !settings.show_for_anon) {
    return;
  }

  // All users get direct link to Workplace
  api.addCommunitySectionLink({
    name: "affine-workspace",
    href: settings.affine_url,
    title: settings.affine_link_title,
    text: settings.affine_link_title,
    icon: settings.affine_link_icon,
  });

  // YOD-517: worX, directly beneath Workplace.
  //
  // Added here rather than in a component of its own. Placement is done with
  // CSS `order` on the Community section (see common.scss), so two separate
  // components would each pin themselves and their relative position would
  // come down to which stylesheet loaded last — a coin flip on every deploy.
  // One component owning both links makes "worX sits below Workplace" a fact
  // rather than a race.
  if (settings.worx_enabled) {
    api.addCommunitySectionLink({
      name: "worx-marketplace",
      href: settings.worx_url,
      title: settings.worx_link_title,
      text: settings.worx_link_title,
      icon: settings.worx_link_icon,
    });
  }

  // YOD-659: yoDEV Decisions, directly beneath worX — same component for the
  // same reason worX is here.
  //
  // Registered with the class form of addCommunitySectionLink rather than the
  // object form: only the class form can supply `badgeText`, which is how the
  // "Nuevo" pill is rendered (Discourse's own .sidebar-section-link-content-badge,
  // so it is styled by the theme like every other sidebar badge). The URL is
  // resolved once here: the reader's locale cannot change without a reload.
  const decisionsHref = safeHttpsUrl(decisionsUrl());
  if (settings.decisions_enabled && decisionsHref) {
    api.addCommunitySectionLink((BaseCommunitySectionLink) => {
      return class DecisionsSectionLink extends BaseCommunitySectionLink {
        get name() {
          return "yodev-decisions";
        }

        get href() {
          return decisionsHref;
        }

        get title() {
          return settings.decisions_link_title;
        }

        get text() {
          return settings.decisions_link_title;
        }

        get defaultPrefixValue() {
          return settings.decisions_link_icon;
        }

        get badgeText() {
          return settings.decisions_new_badge
            ? i18n(themePrefix("decisions.badge"))
            : undefined;
        }
      };
    });
  }
});
