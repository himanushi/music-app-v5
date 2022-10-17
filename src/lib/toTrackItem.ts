import type { TrackResult } from "capacitor-plugin-musickit";
import type { TrackObject } from "~/graphql/types";

export type TrackItem = {
  artworkUrl?: string;
  index?: number;
  name: string;
};

export const toTrackItem = (track: TrackObject | TrackResult): TrackItem => ({
  artworkUrl: "artworkM" in track ? track.artworkM.url : track.artworkUrl,
  index: track.trackNumber,
  name: track.name,
});
