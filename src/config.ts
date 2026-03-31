export const SITE = {
  website: "https://blog.scozv.com/", // replace this with your deployed domain
  author: "@scozv",
  profile: "https://github.com/scozv",
  desc: "Engineering journal by @scozv. Backend, infrastructure, algorithms, and LLM-assisted problem-solving, since 2013.",
  title: "Code this.",
  ogImage: "og.png",
  lightAndDarkMode: true,
  postPerIndex: 7,
  postPerPage: 7,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: false,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Australia/Perth", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  descBy: "pubDatetime",
} as const;
