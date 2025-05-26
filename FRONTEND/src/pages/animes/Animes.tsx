import { Text, Image, InputGroup, Input, Button } from '@chakra-ui/react'
import '../../App.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa';
import { LuSearch } from 'react-icons/lu';
import '../../styles/movie.css';

interface Anime {
  mal_id: number;
  title: string;
  synopsis: string;
  images: {
    webp: {
      image_url: string;
    }
  };
}

function AnimeComponent() {
  const navigate = useNavigate();
  const [cargado, isCargado] = useState(false);
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [paginacion, setPaginacion] = useState(1);

  const goToDetailAnime = (title: string) => {
    navigate(`/anime-detail/${title}`);
  };
  

  const handleNextPage = () => {
    setPaginacion((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (paginacion > 1) {
      setPaginacion((prev) => prev - 1);
    }
  };

  const fetchAnime = (page = 1) => {
    isCargado(false);
    fetch(`https://api.jikan.moe/v4/top/anime?page=${page}`)
      .then(res => res.json())
      .then(json => {
        setAnimeList(json.data);
        isCargado(true);
      })
      .catch(err => console.error("Fetch error de anime:", err));
  };

  const searchAnime = (title: string) => {
    fetch(`https://api.jikan.moe/v4/anime?q=${title}&page=1`)
      .then(res => res.json())
      .then(json => {
        setAnimeList(json.data);
      })
      .catch(err => console.error("Error al buscar anime:", err));
  };

  const truncateAtWord = (text: string, limit = 75) => {
    if (!text) return "Sinopsis no disponible";
    if (text.length <= limit) return text;
    const trimmed = text.substring(0, limit);
    const lastSpace = trimmed.lastIndexOf(" ");
    return trimmed.substring(0, lastSpace) + "…";
  };

  useEffect(() => {
    fetchAnime(paginacion);
  }, [paginacion]);

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
                    searchAnime(title);
                  } else {
                    fetchAnime(paginacion);
                  }
                }}
                placeholder="Buscar anime" />
            </InputGroup>
          </div>

          <div className="main flex gap-6 justify-center items-center">
            <button className='scale-250' onClick={handlePrevPage}><FaArrowAltCircleLeft /></button>

            <div className="animate grid place-content-center grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-6">
              {animeList.map((anime) => (
                <div
                  key={anime.mal_id}
                  className="group relative w-72 h-50 md:w-80 md:h-48 rounded-lg overflow-hidden bg-black shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                >
                  <Image
                    src={anime.images.webp.image_url}
                    alt="Anime Poster"
                    objectFit="cover"
                    boxSize="100%"
                    className="transition-opacity duration-300 group-hover:opacity-30"
                  />

                  <div className="absolute inset-0  bg-opacity-50 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                  <div className="text-left absolute inset-4 flex flex-col gap-2 justify-center p-8 space-y-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <h2 className="text-white font-bold">{anime.title}</h2>
                    <Text textStyle="xs" className="text-shadow-gray-700 text-sm">
                      {truncateAtWord(anime.synopsis)}
                    </Text>
                    <div className="flex">
                      <Button
                        colorPalette={'orange'}
                        onClick={() => goToDetailAnime(anime.title)}
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

export default AnimeComponent;
