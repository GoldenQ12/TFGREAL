import { Content } from "@/interfaces/content";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { Button, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Movie } from "../movies/interfaces/Movie";
import { Anime } from "../animes/interfaces/Anime";
import { Result } from "../series/interfaces/Serie";
import { Videogame } from "../videogames/interfaces/Videogames";



const MyLists = () => {

    const navigate = useNavigate();
    const { authUser } = useAuthStore(); 
    const [content, setContent] = useState<Content[]>([]);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState<string>(""); // Estado para almacenar el tipo de contenid
    const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
    const IMAGE_URLS =[
        "https://image.tmdb.org/t/p/w500/",
        "",
    ]



    const getCollection = async (type: string) => {
        const collectionIndex = type === "anime" ? 0 : type === "movies" ? 1 : type === "series" ? 2 : 3;
        const fetchedContent: Content[] = [];

        if (!authUser) {
          console.warn("Collection type not found in user data");
          return;
        }
        console.log("Buscando collection por tipo: ", type);
        console.log("Collection: ", collectionIndex);
        switch (collectionIndex) {
            case 0:
                { 
                    const data = authUser.collections.anime as unknown;
                    if (Array.isArray(data)) {
                        (data as Anime[]).forEach((anime: Anime) => {
                            fetchedContent.push({
                                id: anime.id,
                                title: anime.title,
                                description: anime.synopsis,
                                image: anime.images.webp.image_url,
                                type: type
                            });
                        });
                    }
                    setType("anime")
                    setSelectedImageUrl(IMAGE_URLS[1]); 
                    console.log(data);
                    setContent(fetchedContent);
                    break; 
                }
            case 1:
                { 
                    const data = authUser.collections.movies as unknown;
                    if (Array.isArray(data)) {
                        (data as Movie[]).forEach((movie: Movie) => {
                            fetchedContent.push({
                                id: movie.id,
                                title: movie.title || movie.original_title,
                                description: movie.overview,
                                image: movie.poster_path,
                                type: type
                            });
                        });
                    }
                    setType("movies")
                    setSelectedImageUrl(IMAGE_URLS[0]);
                    setContent(fetchedContent);
                    break; 
                }
            case 2:
                {
                    const data = authUser.collections.series as unknown;
                    if (Array.isArray(data)) {
                        (data as Result[]).forEach((serie: Result) => {
                            fetchedContent.push({
                                id: serie.id,
                                title: serie.name,
                                description: serie.overview,
                                image: serie.poster_path,
                                type: type
                            });
                        });
                    }
                    setType("series")
                    setSelectedImageUrl(IMAGE_URLS[0]);
                    setContent(fetchedContent);
                    console.log(data);
                    break;
                }
            case 3:
                {
                    const data = authUser.collections.videogames as unknown;
                    console.log("Data", data)
                    if (Array.isArray(data)) {
                        (data as Videogame[]).forEach((videogame: Videogame) => {
                            fetchedContent.push({
                                id: videogame.id,
                                title: videogame.name,
                                description: videogame.summary,
                                image: videogame.cover?.url,
                                type: type
                            });
                        });
                    }
                    setType("games")
                    setSelectedImageUrl(IMAGE_URLS[1]); 
                    console.log(fetchedContent);
                    setContent(fetchedContent);
                    break; 
                }
        }
        
        setLoading(true);
        
      };

    const truncateAtWord = (text : string, limit = 75) => {
    if (text.length <= limit) return text;
    
    const trimmed = text.substring(0, limit);
    const lastSpace = trimmed.lastIndexOf(" ");
    return trimmed.substring(0, lastSpace) + "…";
    }

    const goToDetail = (type : string,  title: string) => {
        switch (type) {
            case 'anime':
                navigate(`/anime-detail/${title}`);
                break;
            case 'movies':
                navigate(`/movie-detail/${title}`);
                break;
            case 'series':
                navigate(`/series-detail/${title}`);
                break;
                case 'games':
                    navigate(`/game-detail/${title}`);
                    break;
            default:
                break;
        }
      }


    return (
        <div className="min-h-screen flex">
            <div className="w-full flex justify-between gap-4 p-4">
                <aside className="w-6/12 shadow-lg p-6">
                    <nav className="space-y-4 flex justify-between gap-4 h-9/12 flex-col">
                        <div onClick={async () => await getCollection("movies")} className="text-right border-8 border-black hover:text-white p-4  transition duration-300 ease-in-out cursor-pointer">
                            <button className="sidebar-button text-right inline-block border-8 border-black hover:text-white rounded-2xl shadow-xl p-8 transition duration-300 ease-in-out cursor-pointer">Peliculas 🎞️</button>
                        </div>
                        <div onClick={async () => await getCollection("series")} className="text-right border-8 border-black hover:text-white p-4  transition duration-300 ease-in-out cursor-pointer">
                            <button className="sidebar-button text-right inline-block border-8 border-black hover:text-white rounded-2xl shadow-xl p-8 transition duration-300 ease-in-out cursor-pointer">Series 📺</button>
                        </div>
                        <div onClick={async () => await getCollection("videogames")} className="text-right border-8 border-black hover:text-white p-4  transition duration-300 ease-in-out cursor-pointer">
                            <button className="sidebar-button text-right inline-block border-8 border-black hover:text-white rounded-2xl shadow-xl p-8 transition duration-300 ease-in-out cursor-pointer">Videojuegos 🎮</button>
                        </div>
                        <div onClick={async () => await getCollection("anime")} className="text-right border-8 border-black hover:text-white p-4  transition duration-300 ease-in-out cursor-pointer">
                            <button className="sidebar-button text-right inline-block border-8 border-black hover:text-white rounded-2xl shadow-xl p-8 transition duration-300 ease-in-out cursor-pointer">Anime ㊗️</button>
                        </div>
                    </nav>
                </aside>
                    <main className="flex-1 p-8 flex flex-col ">
                    {!loading && <p className="text-gray-600 mb-4">Elige una categoría</p>}
                        {loading && <div className="animate m-3 grid place-content-center grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 p-6">
                                  {content.map((contenido, key) => (
                                    <div
                          key={key}
                          className="flex flex-col group relative w-50 h-50 md:w-50 md:h-48 rounded-lg overflow-hidden bg-black shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                        >
                          <Image
                            src={
                              contenido.image
                                ? `${selectedImageUrl}${contenido.image}`
                                : "https://placehold.co/600x400?font=roboto&text=Imagen+no+disponible"
                            }
                            alt="Movie Poster"
                            objectFit="cover"
                            boxSize="100%"
                            className="transition-opacity duration-300 group-hover:opacity-30"
                          />
                        
                          {/* BACKDROP OVERLAY */}
                          <div className="absolute inset-0  bg-opacity-50 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                        
                          {/* TEXT CONTENT */}
                          <div className="text-left absolute inset-4 flex flex-col gap-2 justify-center p-8 space-y-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <h2 className="text-white font-bold">{contenido.title}</h2>
                            <Text textStyle="xs" className="text-shadow-gray-700 text-sm">
                              {contenido.description ? truncateAtWord(contenido.description) : "Sin descripción"}
                            </Text>
                        
                            <div className="flex flex-col">
                              <Button
                                colorPalette={'orange'}
                                onClick={() => goToDetail(type, contenido.title)} 
                                className="text-sm px-4 py-2 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-700 transition">
                                Ver Detalles
                              </Button>
                            </div>
                          </div>
                          <div className="">
                            
                          </div>
                        </div>
                                  ))}
                    </div>}
                </main>
            </div>
        </div>
    )
}

export default MyLists