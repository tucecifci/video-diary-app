export interface Video {
  id: string;
  name: string;
  description: string;
  uri: string; // Cropped video URI
  originalUri?: string; // Original video URI (optional)
  createdAt: string; // ISO date string
  duration?: number; // Duration in seconds (should be 5 for cropped videos)
}
