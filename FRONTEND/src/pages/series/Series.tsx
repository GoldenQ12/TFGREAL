import { Text, Image, InputGroup, Input, Button } from '@chakra-ui/react'
import '../../App.css'
import { useEffect, useState } from 'react';
import { Serie, Result } from './interfaces/Serie';
import '../../styles/movie.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa';
import { LuSearch } from 'react-icons/lu';

function Series() {
  const navigate = useNavigate();
  const [cargado, isCargado] = useState(false);
  const [filteredSeries, setFilteredSeries] = useState<Result[]>([]);
  const [paginacion, setPaginacion] = useState(1);

  const API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOWQ0NTZlOTVlZWE1Y2Y4ZjU0NjBjNWY0YWM5MDk3MiIsIm5iZiI6MTczOTE4MzYxMC4wODcwMDAxLCJzdWIiOiI2N2E5ZDVmYTZjYTgxNTQ2MDQwZjc3MDkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.pZsQwqGzp0zElh9eSnvmJOe-OET-TokwsHm-ZgqM2g4'; // Pon aquí tu token de acceso
  const BASE_URL = 'https://api.themoviedb.org/3';

  const goToDetailSerie = (name: string) => {
    navigate(`/series-detail/${name}`);
  };

  const handleNextPage = () => {
    setPaginacion(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (paginacion > 1) setPaginacion(prev => prev - 1);
  };

  const fetchPopularSeries = () => {
    isCargado(false);
    fetch(`${BASE_URL}/tv/popular?language=es-ES&page=${paginacion}`, {
      headers: {
        accept: 'application/json',
        Authorization: API_KEY,
      },
    })
      .then((res) => res.json())
      .then((json: Serie) => {
        setFilteredSeries(json.results);
        isCargado(true);
      })
      .catch((err) => console.error('Error al cargar series populares:', err));
  };
  

  const searchSeries = (query: string) => {
    if (!query) return fetchPopularSeries();
    fetch(`${BASE_URL}/search/tv?query=${encodeURIComponent(query)}&language=es-ES&page=${paginacion}`, {
      headers: {
        accept: 'application/json',
        Authorization: API_KEY
      }
    })
      .then(res => res.json())
      .then(json => {
        setFilteredSeries(json.results);
      })
      .catch(err => console.error('Error en la búsqueda de series:', err));
  };

  const truncateAtWord = (text: string, limit = 75) => {
    if (text.length <= limit) return text;
    const trimmed = text.substring(0, limit);
    const lastSpace = trimmed.lastIndexOf(" ");
    return trimmed.substring(0, lastSpace) + "…";
  };

  useEffect(() => {
    fetchPopularSeries();
  }, [paginacion]);

  return (
    <>
      {cargado && (
        <div className="App flex flex-col gap-6 justify-center items-center">
          <div className="searchbar w-8/12">
            <InputGroup flex="1" startElement={<LuSearch />}>
              <Input
                onChange={(e) => searchSeries(e.target.value)}
                placeholder="Buscar serie"
              />
            </InputGroup>
          </div>

          <div className="main flex gap-6 justify-center items-center">
            <button className='scale-250' onClick={handlePrevPage}><FaArrowAltCircleLeft /></button>

            <div className="animate grid place-content-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-6">
              {filteredSeries.map((serie, key) => (
                <div
                  key={key}
                  className="group relative w-72 h-50 md:w-80 md:h-48 rounded-lg overflow-hidden bg-black shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                >
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

                  <div className="absolute inset-0 bg-opacity-50 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  <div className="text-left absolute inset-4 flex flex-col gap-2 justify-center p-8 space-y-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <h2 className="text-white font-bold">{serie.name}</h2>
                    <Text textStyle="xs" className="text-shadow-gray-700 text-sm">
                      {truncateAtWord(serie.overview || 'Sinopsis no disponible')}
                    </Text>
                    <div className="flex">
                      <Button
                        colorPalette="orange"
                        onClick={() => goToDetailSerie(serie.name)}
                        className="text-sm px-4 py-2 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-700 transition"
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className='scale-250' onClick={handleNextPage}><FaArrowAltCircleRight /></button>
          </div>
        </div>
      )}
    </>
  );
}

export default Series;
