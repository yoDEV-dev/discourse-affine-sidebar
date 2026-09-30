import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { service } from "@ember/service";
import { i18n } from "discourse-i18n";
import { decisionsUrl, safeHttpsUrl } from "../lib/decisions";

// YOD-659 — announces yoDEV Decisions on the community landing pages.
//
// What this deliberately is NOT: a Discourse banner topic. A banner topic is a
// post, and creating one notifies watchers; this is theme markup and nothing
// else. It creates no topic or post, calls no API and sends no notification.
//
// Rendered in the `discovery-list-controls-above` outlet, which only exists on
// discovery routes, and then narrowed further to the three landing URLs below.
// A category, tag or /top listing is somebody already looking for something;
// the landing page is where the forum introduces what it has.
const LANDING_PATHS = new Set(["/", "/latest", "/categories"]);

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function storageKey() {
  // Bump `decisions_banner_version` to show the banner again to people who
  // closed an earlier version — e.g. after a copy change.
  return `yodev_decisions_banner_dismissed_v${settings.decisions_banner_version || "1"}`;
}

function readDismissed() {
  try {
    return window.localStorage.getItem(storageKey()) === "1";
  } catch {
    // Private mode, blocked storage: show the banner rather than crash, and
    // accept that dismissal will not persist for this reader.
    return false;
  }
}

function writeDismissed() {
  try {
    window.localStorage.setItem(storageKey(), "1");
  } catch {
    // See readDismissed. The banner still closes for this page view.
  }
}

// Dates are compared as UTC calendar days, both ends inclusive. A setting that
// is set but malformed closes the window rather than opening it: a typo in an
// end date should not leave a campaign banner up forever.
function withinDateWindow() {
  const today = new Date().toISOString().slice(0, 10);
  const start = (settings.decisions_banner_start_date || "").trim();
  const end = (settings.decisions_banner_end_date || "").trim();

  if (start && (!DATE_RE.test(start) || today < start)) {
    return false;
  }
  if (end && (!DATE_RE.test(end) || today > end)) {
    return false;
  }
  return true;
}

export default class DecisionsBanner extends Component {
  @service router;
  @service currentUser;

  @tracked dismissed = readDismissed();

  get isLandingPage() {
    // currentURL is tracked, so this re-evaluates on every SPA navigation —
    // no history patching, no stale banner left behind on a topic page.
    const path = (this.router.currentURL || "").split(/[?#]/)[0];
    const normalized = path.length > 1 ? path.replace(/\/+$/, "") : path;
    return LANDING_PATHS.has(normalized || "/");
  }

  get href() {
    return safeHttpsUrl(decisionsUrl(), settings.decisions_banner_anchor);
  }

  get shouldRender() {
    if (!settings.decisions_banner_enabled || this.dismissed) {
      return false;
    }
    if (!this.currentUser && !settings.decisions_banner_show_for_anon) {
      return false;
    }
    return this.isLandingPage && withinDateWindow() && !!this.href;
  }

  @action
  dismiss() {
    writeDismissed();
    this.dismissed = true;
  }

  <template>
    {{#if this.shouldRender}}
      <aside
        aria-label={{i18n (themePrefix "decisions.banner.region_label")}}
        class="yodev-decisions-banner"
      >
        <div class="yodev-decisions-banner__content">
          <p class="yodev-decisions-banner__eyebrow">
            {{i18n (themePrefix "decisions.banner.eyebrow")}}
          </p>
          <p class="yodev-decisions-banner__title" role="heading" aria-level="2">
            {{i18n (themePrefix "decisions.banner.title")}}
          </p>
          <p class="yodev-decisions-banner__body">
            {{i18n (themePrefix "decisions.banner.body")}}
            {{! Greg: the invitation to try it is the point — literally highlighted. }}
            <mark class="yodev-decisions-banner__highlight">
              {{i18n (themePrefix "decisions.banner.highlight")}}
            </mark>
          </p>
          <div class="yodev-decisions-banner__actions">
            <a class="yodev-decisions-banner__cta" href={{this.href}}>
              {{i18n (themePrefix "decisions.banner.cta")}}
            </a>
          </div>
          <p class="yodev-decisions-banner__note">
            {{i18n (themePrefix "decisions.banner.disclaimer")}}
          </p>
        </div>
        <button
          aria-label={{i18n (themePrefix "decisions.banner.dismiss")}}
          class="yodev-decisions-banner__dismiss"
          title={{i18n (themePrefix "decisions.banner.dismiss")}}
          type="button"
          {{on "click" this.dismiss}}
        >
          <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="16"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2.25"
            viewBox="0 0 24 24"
            width="16"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </aside>
    {{/if}}
  </template>
}
