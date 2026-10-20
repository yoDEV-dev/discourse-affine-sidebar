import { apiInitializer } from "discourse/lib/api";

export default apiInitializer((api) => {
  const currentUser = api.getCurrentUser();

  // Check if we should show the sidebar links for anonymous users
  if (!currentUser && !settings.show_for_anon) {
    return;
  }

  // YOD-762: the marketing site, first. Forum readers mostly arrive from
  // search and never see yodev.dev; once they dismiss the promo banners,
  // nothing else on the forum points there. Its position comes from CSS
  // `order` like the others (see common.scss), not from this call order.
  if (settings.home_enabled) {
    api.addCommunitySectionLink({
      name: "yodev-home",
      href: settings.home_url,
      title: settings.home_link_title,
      text: settings.home_link_title,
      icon: settings.home_link_icon,
    });
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

  // YOD-767: worX support, directly beneath the token calculator. The
  // calculator lives in yodev-token-calculator-theme at slot -98, so this
  // takes -97 (see common.scss).
  if (settings.support_enabled) {
    api.addCommunitySectionLink({
      name: "yodev-support",
      href: settings.support_url,
      title: settings.support_link_title,
      text: settings.support_link_title,
      icon: settings.support_link_icon,
    });
  }
});
