import type { TrackObject } from "~/graphql/types";

export type TrackItem = {
  artworkUrl?: string;
  index?: number;
  name: string;
};

export const toTrackItem = (track: MusicKit.LibrarySongs | TrackObject): TrackItem => {
  if ("attributes" in track) {
    return {
      artworkUrl: track.attributes.artwork.url,
      index: track.attributes.trackNumber,
      name: track.attributes.name,
    };
  }
  return {
    artworkUrl: track.artworkM.url,
    index: track.trackNumber,
    name: track.name,
  };
};
