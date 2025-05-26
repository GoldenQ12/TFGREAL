import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge, Button, Image } from "@chakra-ui/react";
import { FaBookBookmark, FaDeleteLeft } from "react-icons/fa6";
import { Result } from "../interfaces/Serie"; // Tu interfaz Result de Serie
import { Trailer } from "../interfaces/Trailer"; // Asumiendo que puedes usar la misma interfaz que películas
import '../../../App.css';
import { useAuthStore } from "@/store/useAuthStore";

function DetailSerie() {
  const { title } = useParams();
  const [serie, setSerie] = useState<Result>({} as Result);
  const [trailer, setTrailer] = useState<Trailer>({} as Trailer);
  const { updateCollections, deleteCollections } = useAuthStore();

  const AddFavourite = async (serie: Result) => {
    const data = {
      entertainment: serie,
      collectionType: 'series'
    };
    await updateCollections(data);
  };

  const DeleteFavourite = async (serie: Result) => {
    const data = {
      entertainment: serie,
      collectionType: 'series'
    };
    await deleteCollections(data);
  };

  useEffect(() => {
    const API_KEY = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOWQ0NTZlOTVlZWE1Y2Y4ZjU0NjBjNWY0YWM5MDk3MiIsIm5iZiI6MTczOTE4MzYxMC4wODcwMDAxLCJzdWIiOiI2N2E5ZDVmYTZjYTgxNTQ2MDQwZjc3MDkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.pZsQwqGzp0zElh9eSnvmJOe-OET-TokwsHm-ZgqM2g4`; // Usa tu token de acceso completo

    // Función para buscar la serie por nombre
    const fetchSerieByName = async () => {
      console.log(title);
      if (!title) return;  // Agregado para evitar peticiones innecesarias si no hay `name`
      const url = `https://api.themoviedb.org/3/search/tv?query=${title}&language=es-ES&page=1`;
      try {
        const res = await fetch(url, {
          headers: {
            accept: 'application/json',
            Authorization: API_KEY,
          },
        });
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setSerie(data.results[0]);
          fetchSerieTrailerById(data.id); 
        }
      } catch (err) {
        console.error("Error al obtener detalles de la serie:", err);
      }
    };
    

    // Función para obtener el trailer de la serie por ID
    const fetchSerieTrailerById = async (serieId: number) => {
      const url = `https://api.themoviedb.org/3/tv/${serieId}/videos`;
      try {
        const res = await fetch(url, {
          headers: {
            accept: 'application/json',
            Authorization: API_KEY
          }
        });
        const data = await res.json();
        console.log(data);
        setTrailer(data.results?.[0]);
      } catch (err) {
        console.error("Error al obtener trailer de la serie:", err);
      }
    };

    fetchSerieByName();
    fetchSerieTrailerById(serie.id); // Llamar la función cuando el componente se monta
  }, [title, serie.id]); // Vuelve a ejecutarse cuando `name` cambia

  return (
    <div className="flex justify-center">
      <div className="App flex flex-col md:flex-row gap-8 rounded-lg max-w-5xl mx-auto">
        <div className="image w-full md:w-1/2">
          <Image
            src={
              serie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${serie.poster_path}`
                : "https://placehold.co/600x400?font=roboto&text=Imagen+no+disponible"
            }
            alt="Serie Poster"
            objectFit="cover"
            boxSize="100%"
            className="transition-opacity duration-300 group-hover:opacity-30"
          />
        </div>

        <div className="text w-full md:w-1/2 flex flex-col gap-4 text-center md:text-left">
          <h1 className="text-3xl font-bold">{serie.name}</h1>
          <p>{serie.overview || "Sin resumen"}</p>
          <p>
            <span className="font-medium text-gray-700">📅 Primera emisión:</span>{" "}
            {serie.first_air_date?.toString()}
          </p>
          <Badge className="w-25" colorPalette={serie.vote_average < 5 ? 'red' : 'green'}size="lg">
            ⭐ {serie.vote_average?.toFixed(1) || "N/A"} / 10
          </Badge>

          {trailer ? (
            <div className="trailer">
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Trailer de la serie"
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
            <Button onClick={() => AddFavourite(serie)} variant="surface" colorPalette="green">
              Agregar a favoritos <FaBookBookmark />
            </Button>
            <Button onClick={() => DeleteFavourite(serie)} variant="surface" colorPalette="red">
              Eliminar de favoritos <FaDeleteLeft />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailSerie;
