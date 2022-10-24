export type TrackItem = {
  artworkUrl?: string;
  index?: number;
  name: string;
};

export const toTrackItem = (track: MusicKit.LibrarySongs): TrackItem => ({
  artworkUrl: track.attributes.artwork.url,
  index: track.attributes.trackNumber,
  name: track.attributes.name,
});
