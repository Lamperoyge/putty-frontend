import humanizeDuration from "humanize-duration";

export const shortHumanizeDuration = humanizeDuration.humanizer({
  language: "shortEn",
  spacer: "",
  largest: 2,
  languages: {
    shortEn: {
      y: () => "y",
      mo: () => "mo",
      w: () => "w",
      d: () => "d",
      h: () => "h",
      m: () => "m",
      s: () => "s",
      ms: () => "ms",
    },
  },
});
