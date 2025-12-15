import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.0.0", (api) => {
  const currentUser = api.getCurrentUser();
  const showForAnon = api.container.lookup("service:site-settings").show_for_anon;

  // Only show for logged-in users unless configured otherwise
  if (!currentUser && !showForAnon) {
    return;
  }

  const siteSettings = api.container.lookup("service:site-settings");
  const affineUrl = siteSettings.affine_url || "https://affine.yodev.dev";
  const linkTitle = siteSettings.affine_link_title || "Workspace";
  const linkIcon = siteSettings.affine_link_icon || "cube";

  api.addSidebarSection(
    (BaseCustomSidebarSection, BaseCustomSidebarSectionLink) => {
      const AFFiNELink = class extends BaseCustomSidebarSectionLink {
        get name() {
          return "affine-workspace";
        }

        get route() {
          return null;
        }

        get href() {
          return affineUrl;
        }

        get title() {
          return linkTitle;
        }

        get text() {
          return linkTitle;
        }

        get prefixType() {
          return "icon";
        }

        get prefixValue() {
          return linkIcon;
        }

        get prefixColor() {
          return null;
        }
      };

      const AFFiNESection = class extends BaseCustomSidebarSection {
        get name() {
          return "affine";
        }

        get title() {
          return "AFFiNE";
        }

        get text() {
          return "";
        }

        get links() {
          return [new AFFiNELink()];
        }

        get displaySection() {
          return true;
        }
      };

      return AFFiNESection;
    },
    "top"
  );
});
