import { Text, Image, InputGroup, Input, Button } from '@chakra-ui/react'
import '../../App.css'
import { useEffect, useState } from 'react';
import { videogames } from './interfaces/Videogames.ts';
import '../../styles/movie.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa';
import { LuSearch } from 'react-icons/lu';

function Videogames() {
  const navigate = useNavigate();
  const [cargado, isCargado] = useState(false);
  const [filteredGames, setFilteredGames] = useState<videogames[]>([]);
  const [paginacion, setPaginacion] = useState(0); // IGDB empieza desde 0

  const goToDetailGame = (name: string) => {
    navigate(`/game-detail/${name}`);
  };

  const handleNextPage = () => {
    setPaginacion(paginacion + 1);
  };

  const handlePrevPage = () => {
    if (paginacion > 0) {
      setPaginacion(paginacion - 1);
    }
  };

  async function IniciarAplicacion() {
    isCargado(false);
    try {
      const res = await fetch(`http://localhost:5001/api/games?page=${paginacion}`);
      if (!res.ok) throw new Error('Error al obtener juegos');
      const data = await res.json();
      console.log("🎮 Datos recibidos en IniciarAplicacion:", data);
      setFilteredGames(data);
    } catch (err) {
      console.error("Error al obtener juegos:", err);
    } finally {
      isCargado(true);
    }
  }

  const truncateAtWord = (text: string, limit = 75) => {
    if (!text) return "Sinopsis no disponible";
    if (text.length <= limit) return text;
    const trimmed = text.substring(0, limit);
    const lastSpace = trimmed.lastIndexOf(" ");
    return trimmed.substring(0, lastSpace) + "…";
  };

  const GetGamesBySearch = async (title: string) => {
    try {
      const res = await fetch(`http://localhost:5001/api/games/search?query=${title}`);
      if (!res.ok) throw new Error('Error al buscar juegos');
      const data = await res.json();
      console.log("🔍 Datos recibidos en búsqueda:", data);
      setFilteredGames(data);
    } catch (err) {
      console.error("Error al buscar juegos:", err);
    }
  };

  useEffect(() => {
    IniciarAplicacion();
  }, [paginacion]); // Cambia la página automáticamente cuando se actualiza el estado de la paginación

  return (
    <>
      {cargado && (
        <div className="App flex flex-col gap-6 justify-center items-center">
          <div className="searchbar w-8/12">
            <InputGroup flex="1" startElement={<LuSearch />} >
              <Input 
                onChange={(e) => {
                  const title = e.target.value;
                  if (title.length > 0) {
                    GetGamesBySearch(title);
                  } else {
                    IniciarAplicacion();
                  }
                }}
                placeholder="Buscar videojuego" />
            </InputGroup>
          </div>

          <div className="main flex gap-6 justify-center items-center">
            <button className="scale-250" onClick={handlePrevPage}><FaArrowAltCircleLeft /></button>
            <div className="animate grid place-content-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-6">
              {filteredGames.map((game, key) => (
                <div
                  key={key}
                  className="group relative w-72 h-50 md:w-80 md:h-48 rounded-lg overflow-hidden bg-black shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                >
                  <Image
                    src={
                      game.cover?.url
                        ? game.cover.url.replace('t_thumb', 't_cover_big')
                        : "https://placehold.co/600x400?font=roboto&text=Imagen+no+disponible"
                    }
                    alt="Game Cover"
                    objectFit="cover"
                    boxSize="100%"
                    className="transition-opacity duration-300 group-hover:opacity-30"
                  />

                  <div className="absolute inset-0 bg-opacity-50 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  <div className="text-left absolute inset-4 flex flex-col gap-2 justify-center p-8 space-y-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <h2 className="text-white font-bold">{game.name}</h2>
                    <Text textStyle="xs" className="text-shadow-gray-700 text-sm">
                    {truncateAtWord(game.summary ?? "")}
                    </Text>
                    <div className="flex">
                      <Button
                        colorPalette={'orange'}
                        onClick={() => goToDetailGame(game.name)}
                        className="text-sm px-4 py-2 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-700 transition"
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="scale-250" onClick={handleNextPage}><FaArrowAltCircleRight /></button>
          </div>
        </div>
      )}
    </>
  );
}

export default Videogames;
