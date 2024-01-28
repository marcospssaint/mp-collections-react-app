import { useState } from "react";

import { MidiaVideoComponent, ModalMidiaVideo } from '../../components';

import { ANIMES, IMidiaVideoKV } from '../../entities';

export const Anime = () => {
    const [animeSelected, setAnimeSelected] = useState<IMidiaVideoKV>();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const onClickMore = (anime: IMidiaVideoKV) => {
        setAnimeSelected(anime);
        setIsModalOpen(true);
    }

    const hideModal = () => {
        setIsModalOpen(false);
    };

    return (<>
        <MidiaVideoComponent
            title='Animes'
            type={ANIMES}
            isLanguage={false}
            isWatcher={true}
            isOwned={true}
            onClickMore={onClickMore}
        />

        <ModalMidiaVideo
            midiaVideo={animeSelected}
            typeMidiaVideo={ANIMES}
            isModalOpen={isModalOpen}
            hideModal={hideModal} />
    </>)
};