import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.0.1", (api) => {
  const currentUser = api.getCurrentUser();

  // Only show for logged-in users
  if (!currentUser) {
    return;
  }

  api.addCommunitySectionLink(
    {
      name: "affine-workspace",
      href: settings.affine_url,
      title: settings.affine_link_title,
      text: settings.affine_link_title,
      icon: settings.affine_link_icon,
    },
    true
  );
});
