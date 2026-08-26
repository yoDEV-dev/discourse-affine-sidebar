import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.0.1", (api) => {
  const currentUser = api.getCurrentUser();

  // Check if we should show for anonymous users
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
});
