import React, { useMemo, useState } from 'react';
import { HashRouter, Route, Routes as Router } from 'react-router-dom';
import { MidiaCollectionComponent, MidiaContent, MidiaLeituraSubComponent } from '../components';
import {
  ErroPage,
  Home,
  LayoutTemplate,
  Login,
  MidiaTemplate
} from '../templates';
import { RouteAuth } from './route-auth';

import { ThemeContext } from '.././contexts/theme-context';
import { MOVIES, TV_SHOWS } from '../entities';
import { BOOKS, COMICS, LEITURA, MANGAS } from '../entities/midia-leitura';
import { ANIMES, TV_TOKUSATSU, VIDEO } from '../entities/midia-video';

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

            <Route path="/movies/?page=:page/collection" element={<MidiaCollectionComponent />} />
            <Route path="/movies/:id/collection" element={<MidiaCollectionComponent />} />
            <Route path="/movies/?page=:page" element={<MidiaContent />} />
            <Route path="/movies/:id" element={<MidiaContent />} />
            <Route path="/movies" element={<MidiaTemplate title='Movies' typeMidia={VIDEO} type={MOVIES} />} />

            <Route path="/tv-shows/?page=:page" element={<MidiaContent />} />
            <Route path="/tv-shows/:id" element={<MidiaContent />} />
            <Route path="/tv-shows" element={<MidiaTemplate title='TV Shows' typeMidia={VIDEO} type={TV_SHOWS} />} />

            <Route path="/tv-tokusatsus/?page=:page" element={<MidiaContent />} />
            <Route path="/tv-tokusatsus/:id" element={<MidiaContent />} />
            <Route path="/tv-tokusatsus" element={<MidiaTemplate title='Tokusatsus' typeMidia={VIDEO} type={TV_TOKUSATSU} />} />

            <Route path="/animes/?page=:page" element={<MidiaContent />} />
            <Route path="/animes/:id" element={<MidiaContent />} />
            <Route path="/animes" element={<MidiaTemplate title='Animes' typeMidia={VIDEO} type={ANIMES} />} />

            <Route path="/mangas/?page=:page" element={<MidiaContent />} />
            <Route path="/mangas/:id" element={<MidiaContent />} />
            <Route path="/mangas" element={<MidiaTemplate title='Mangas' typeMidia={LEITURA} type={MANGAS}/>} />

            <Route path="/comics/?page=:page" element={<MidiaContent />} />
            <Route path="/comics/:id/collection" element={<MidiaCollectionComponent />} />
            <Route path="/comics/:id" element={<MidiaContent />} />
            <Route path="/comics" element={<MidiaTemplate title='Comics' typeMidia={LEITURA} type={COMICS}/>} />

            <Route path="/books/:id" element={<MidiaLeituraSubComponent />} />
            <Route path="/books" element={<MidiaTemplate title='Books' typeMidia={LEITURA} type={BOOKS} />} />
          </Route>
        </Router>
      </HashRouter>
    </ThemeContext.Provider>
  );
};

export default Routes;