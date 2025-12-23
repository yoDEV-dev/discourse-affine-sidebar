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
});
