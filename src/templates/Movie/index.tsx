import { useState } from 'react';

import { MidiaVideoComponent, ModalMidiaVideo } from '../../components';
import { IMidiaVideoKV, MOVIES } from '../../entities';

export const Movie: React.FC = () => {
    const [movieSelected, setMovieSelected] = useState({} as IMidiaVideoKV);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const onClickMore = (movie: IMidiaVideoKV) => {
        setIsModalOpen(true);
        setMovieSelected(movie);
    }

    const hideModal = () => {
        setIsModalOpen(false);
    };

    return (<>
        <MidiaVideoComponent
            title='Movies'
            type={MOVIES}
            isWatcher={true}
            isOwned={true}
            isVisibleCollection={true}
            onClickMore={onClickMore}
        />

        <ModalMidiaVideo
            midiaVideo={movieSelected}
            typeMidiaVideo={MOVIES}
            isModalOpen={isModalOpen}
            hideModal={hideModal} />
    </>)
};