import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.0.0", (api) => {
  const currentUser = api.getCurrentUser();

  // Only show for logged-in users
  if (!currentUser) {
    return;
  }

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
          return settings.affine_url;
        }

        get title() {
          return settings.affine_link_title;
        }

        get text() {
          return settings.affine_link_title;
        }

        get prefixType() {
          return "icon";
        }

        get prefixValue() {
          return settings.affine_link_icon;
        }
      };

      const AFFiNESection = class extends BaseCustomSidebarSection {
        get name() {
          return "affine";
        }

        get title() {
          return settings.affine_link_title;
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
