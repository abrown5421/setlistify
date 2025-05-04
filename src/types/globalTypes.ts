export interface ViewportState {
  width: number;
  height: number;
  type: "mobile" | "tablet" | "desktop";
}

export interface AnimatedContainerProps {
  children: React.ReactNode;
  isEntering: boolean;
  className?: string;
  entry?: string;
  exit?: string;
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