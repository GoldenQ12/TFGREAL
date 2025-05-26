
export interface Videogame {
  id:                 number;
  age_ratings:        number[];
  category:           number;
  cover:              {
    url:             string;
  };
  created_at:         number;
  external_games:     number[];
  first_release_date: number;
  genres:             number[];
  keywords:           number[];
  name:               string;
  platforms:          number[];
  release_dates:      number[];
  similar_games:      number[];
  slug:               string;
  summary:            string;
  tags:               number[];
  themes:             number[];
  updated_at:         number;
  url:                string;
  checksum:           string;
  collections:        number[];
  game_type:          number;
  total_rating : number;
}
