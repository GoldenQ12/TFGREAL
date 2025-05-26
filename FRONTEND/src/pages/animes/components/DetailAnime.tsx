import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge, Button, Image } from "@chakra-ui/react";
import { FaBookBookmark, FaDeleteLeft } from "react-icons/fa6";
import { useAuthStore } from "@/store/useAuthStore";
import { Anime } from "../interfaces/Anime";


function DetailAnime() {
  const { title } = useParams(); 
  const [anime, setAnime] = useState<Anime | null>(null);
  const { updateCollections, deleteCollections } = useAuthStore();

  const AddFavourite = async (anime: Anime) => {
    const data = {
      collectionType: "anime",
      entertainment: anime,
    };
    await updateCollections(data);
  };

  const DeleteFavourite = async (anime: Anime) => {
    const data = {
      collectionType: "anime",
      entertainment: anime,
    };
    await deleteCollections(data);
  };

  useEffect(() => {
    const fetchAnimeByTitle = async () => {
      try {
        const res = await fetch(`https://api.jikan.moe/v4/anime?q=${title}`);
        const json = await res.json();
        setAnime(json.data?.[0] || null);
      } catch (err) {
        console.error("Error al buscar anime por título:", err);
      }
    };

    fetchAnimeByTitle();
  }, [title]);

  if (!anime) return <p className="text-center p-8">Cargando anime...</p>;

  return (
    <div className="flex justify-center">
      <div className="App flex flex-col md:flex-row gap-8 rounded-lg max-w-5xl mx-auto">
        <div className="image w-full md:w-1/2">
          <Image
            src={
              anime.images?.webp?.image_url ||
              "https://placehold.co/600x400?font=roboto&text=Imagen+no+disponible"
            }
            alt="Anime Poster"
            objectFit="cover"
            boxSize="100%"
          />
        </div>

        <div className="relative text w-full h-full md:w-1/2 flex flex-col gap-4 text-center md:text-left">
          <h1 className="text-3xl font-bold">{anime.title}</h1>
          <p>{anime.synopsis || "Sin sinopsis disponible"}</p>
          <p>
            <span className="font-medium text-gray-700">📅 Fecha de estreno:</span>{" "}
            {anime.aired?.from?.split("T")[0] || "Desconocida"}
          </p>
          <Badge className="w-25" colorPalette={anime.score < 5 ? "red" : "green"} size="lg">
            ⭐ {anime.score ? anime.score.toFixed(1) : "N/A"} / 10
          </Badge>

          {anime.trailer?.youtube_id ? (
            <div className="trailer my-4">
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                title="YouTube trailer"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <Image
              src="https://placehold.co/600x400?font=roboto&text=Trailer+no+disponible"
              alt="Trailer no disponible"
            />
          )}

          <div className="button-group flex justify-between p-4 rounded-lg">
            <Button
              onClick={() => AddFavourite(anime)}
              variant="surface" 
              colorPalette={'green'}>
              Agregar a favoritos <FaBookBookmark />
            </Button>
            <Button
              onClick={() => DeleteFavourite(anime)}
              variant="surface" 
              colorPalette={'red'}>
              Eliminar de favoritos <FaDeleteLeft />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailAnime;
