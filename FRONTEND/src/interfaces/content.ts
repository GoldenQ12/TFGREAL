export interface Content {
    id: number;
    title: string;
    description: string;
    image: string; 
    type: string | "anime" | "movies" | "series" | "videogames"
}