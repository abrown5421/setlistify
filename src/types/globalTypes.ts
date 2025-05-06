import { ReactNode } from "react";

export interface ViewportState {
  width: number;
  height: number;
  type: "mobile" | "tablet" | "desktop";
}

export interface DrawerState {
  isOpen: boolean;
}

export interface ModalState {
  isOpen: boolean;
  modalContent: ReactNode;
}

export interface AnimatedContainerProps {
  children: React.ReactNode;
  isEntering: boolean;
  className?: string;
  entry?: string;
  exit?: string;
}

export interface SearchBarProps {
  mode: boolean;
}

export interface ActivePageState {
  Name: string;
  In: boolean;
}

export interface AuthenticationState {
  isAuthenticated: boolean;
  token: string | null;
  user: SpotifyUser | null;
}

export interface SpotifyUser {
  display_name: string;
  email: string;
  id: string;
  images: { url: string }[];
}

export interface SearchParamsState {
  artist: string;
  venue: string;
  tour: string;
  year: string;
}

export interface NotificationState {
  open: boolean;
  severity: string;
  message: string;
}

export interface SearchResults {
  type: string;
  itemsPerPage: number;
  page: number;
  total: number;
  setlist: Setlist[];
}

export interface Tour {
  name: string
}

export interface Setlist {
  id: string;
  versionId: string;
  eventDate: string;
  lastUpdated: string;
  artist: Artist;
  tour: Tour;
  venue: Venue;
  sets: {
    set: {
      name?: string;
      song: Song[];
    }[];
  };
  url: string;
}

export interface Artist {
  mbid: string;
  name: string;
  sortName: string;
  disambiguation: string;
  url: string;
}

export interface Venue {
  id: string;
  name: string;
  city: City;
  url: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  coords: {
    lat: number;
    long: number;
  };
  country: {
    code: string;
    name: string;
  };
}

export interface Song {
  name: string;
  info?: string;
}

export interface ExtractedSong {
  slfmTrackName: string;
  slfmArtistName: string;
  slfmTrackSet?: string;
  slfmTrackInfo?: string;
  spotifyTrackId?: string;
  spotifyArtist?: string;
  spotifyTrackName?: string;
  spotifyAlbum?: string;
  spotifyAlbumArt?: string;
}

export interface SpotifyTrackSearchProps {
  token: string;
  trackName: string;
  artistName: string;
  onAdd: (index: number, enrichedData: Partial<ExtractedSong>) => void;
  trackIndex: number;
}