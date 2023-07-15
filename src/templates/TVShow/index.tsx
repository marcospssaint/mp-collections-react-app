import { useState } from "react";

import { MidiaVideoComponent, ModalMidiaVideo } from '../../components';

import { IMidiaVideoKV, TV_SHOWS } from '../../entities';

export const TVShow = () => {
    const [tvShowSelected, setTvShowSelected] = useState<IMidiaVideoKV>();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const onClickMore = (tvShow: IMidiaVideoKV) => {
        setTvShowSelected(tvShow);
        setIsModalOpen(true);
    }

    const hideModal = () => {
        setIsModalOpen(false);
    };

    return (<>
        <MidiaVideoComponent
            title='TV Shows'
            type={TV_SHOWS}
            isWatcher={true}
            isOwned={true}
            onClickMore={onClickMore}
        />

        <ModalMidiaVideo
            midiaVideo={tvShowSelected}
            typeMidiaVideo={TV_SHOWS}
            isModalOpen={isModalOpen}
            hideModal={hideModal} />
    </>)
};