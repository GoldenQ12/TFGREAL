import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../../App.css";
import { FaBookBookmark, FaDeleteLeft } from "react-icons/fa6";
import { useAuthStore } from "../../../store/useAuthStore";
import { Videogame } from "../interfaces/Videogames";
import { Button, Image, Spinner } from "@chakra-ui/react";


function DetailGame() {
  const { title } = useParams<{ title: string }>();
  const [juego, setJuego] = useState<Videogame>({} as Videogame);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { updateCollections, deleteCollections } = useAuthStore();
  // Función para agregar a favoritos
  const AddFavourite = async (game : Videogame) => {
    const data = {
      entertainment : game, // Renombramos "movieTitle" a "entertainment"
      collectionType: 'videogames', // Colección de juegos
    };
    await updateCollections(data); // Actualiza la colección de favoritos con el videojuego
  };

  // Función para eliminar de favoritos
  const DeleteFavourite = async (game : Videogame) => {
    const data = {
      entertainment : game, // Renombramos "movieTitle" a "entertainment"
      collectionType: 'videogames', // Colección de juegos
    };
    await deleteCollections(data); // Elimina el videojuego de los favoritos
  };

  useEffect(() => {
    const GetGameByName = async () => {
      if (!title) return;
      try {
        console.log("Buscando juego por nombre:", title);
        const res = await fetch(`http://localhost:5001/api/games/search?query=${title}`);
        if (!res.ok) throw new Error('Error al obtener juego');
        const data = await res.json();
        setJuego(data[0]); // Me quedo con el primero del array
        setIsLoaded(true);
      } catch (err) {
        console.error("Error buscando juego:", err);
      }
    };

    GetGameByName();
  }, [title]);

  // Este efecto es opcional si necesitas verificar si el juego está en favoritos al cargar la página
  /*(() => {
    const checkIfFavorite = async () => {
      // Aquí asumimos que getFavoriteGames retorna una lista de juegos favoritos del tipo 'Videogame[]'
      const favoriteGames: Videogame[] = await getFavoriteGames(); // Asegúrate de tener esta función en tu store
      const isGameFavorite = favoriteGames.some((game) => game.name === juego.name);
      setIsFavorite(isGameFavorite);
    };

    if (juego.name) {
      checkIfFavorite();
    }
  }, [juego.name, getFavoriteGames]);*/

  return (
    <div className="flex justify-center">
      {!isLoaded && <Spinner size="xl"></Spinner>}
      {isLoaded && <div className="App flex flex-col md:flex-row gap-8 rounded-lg max-w-5xl mx-auto">
        {/* Imagen del juego */}
        <div className="image w-full md:w-1/2">
          <Image
            src={
              juego.cover?.url
                ? juego.cover.url.replace('t_thumb', 't_cover_big')
                : "https://placehold.co/600x400?font=roboto&text=Imagen+no+disponible"
            }
            alt="Serie Poster"
            objectFit="cover"
            boxSize="100%"
            className="transition-opacity duration-300 group-hover:opacity-30"
          />
        </div>

        {/* Información del juego */}
        <div className="relative text w-full h-full md:w-1/2 flex flex-col gap-4 text-center md:text-left">
          <h1 className="text-3xl font-bold">{juego.name}</h1>
  
          <p>{juego.summary ? juego.summary : "Sin resumen disponible"}</p>
  
          {/* Botones de acciones */}
          {isLoaded && <div className="button-group flex justify-between p-4 rounded-lg">
              <Button
                variant="surface"
                colorPalette="green"
                onClick={() => AddFavourite(juego)} // Llama a la función para agregar a favoritos
                className="btn btn-success gap-2"
              >
                Agregar a favoritos <FaBookBookmark />
              </Button>
              <Button
                variant="surface"
                colorPalette="red"
                onClick={() => DeleteFavourite(juego)} // Llama a la función para eliminar de favoritos
                className="btn btn-error gap-2"
              >
                Eliminar de favoritos <FaDeleteLeft />
              </Button>
          </div>}
        </div>
      </div>}
    </div>
  );
}

export default DetailGame;
