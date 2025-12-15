import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.0.1", (api) => {
  const currentUser = api.getCurrentUser();

  // Check if we should show for anonymous users
  if (!currentUser && !settings.show_for_anon) {
    return;
  }

  // For anonymous users, show login prompt on click
  if (!currentUser) {
    api.addCommunitySectionLink({
      name: "affine-workspace",
      href: "#",
      title: settings.affine_link_title,
      text: settings.affine_link_title,
      icon: settings.affine_link_icon,
    });

    api.onPageChange(() => {
      const link = document.querySelector('a[data-link-name="affine-workspace"]');
      if (link) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const dialog = api.container.lookup("service:dialog");
          dialog.alert({
            title: settings.affine_link_title,
            message: settings.anon_message || "You must be logged in to access the Workspace.",
          });
        });
      }
    });
  } else {
    // Logged in users get direct link
    api.addCommunitySectionLink({
      name: "affine-workspace",
      href: settings.affine_url,
      title: settings.affine_link_title,
      text: settings.affine_link_title,
      icon: settings.affine_link_icon,
    });
  }
});
