export interface Anime {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    first_air_date: string;
    name: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    mal_id: number;
    
    title: string;
    synopsis: string;
    images: {
      webp: {
        image_url: string;
      };
    };
    aired: {
      from: string;
    };
    score: number;
    trailer?: {
      youtube_id: string;
    };

  }
  