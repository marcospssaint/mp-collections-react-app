import React, { useState, useMemo } from 'react';
import { HashRouter, Route, Routes as Router } from 'react-router-dom';
import { MidiaLeituraSubComponent } from '../components';
import {
  Anime,
  Book,
  Comic,
  ErroPage,
  Home,
  LayoutTemplate,
  Login,
  Manga,
  Movie, TVShow,
  TVTokusatsu,
} from '../templates';
import { RouteAuth } from './route-auth';

import { ThemeContext } from '.././contexts/theme-context';

const Routes: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const value = useMemo(
    () => ({ collapsed, setCollapsed }),
    [collapsed]
  );

  return (
    <ThemeContext.Provider value={value}>
      <HashRouter>
        <Router>
          <Route>
            <Route path="/" element={<Login />} />
          </Route>
          <Route
            element={<RouteAuth children={<LayoutTemplate />} />} errorElement={<ErroPage />}>
            <Route path="/home" element={<Home />} />

            <Route path="/movies" element={<Movie />} />
            <Route path="/tv-shows" element={<TVShow />} />
            <Route path="/tv-tokusatsus" element={<TVTokusatsu />} />
            <Route path="/animes" element={<Anime />} />

            <Route path="/mangas/?page=:page" element={<MidiaLeituraSubComponent />} />
            <Route path="/mangas/:id" element={<MidiaLeituraSubComponent />} />
            <Route path="/mangas" element={<Manga />} />

            <Route path="/comics/?page=:page" element={<MidiaLeituraSubComponent />} />
            <Route path="/comics/:id" element={<MidiaLeituraSubComponent />} />
            <Route path="/comics" element={<Comic />} />

            <Route path="/books/:id" element={<MidiaLeituraSubComponent />} />
            <Route path="/books" element={<Book />} />
          </Route>
        </Router>
      </HashRouter>
    </ThemeContext.Provider>
  );
};

export default Routes;