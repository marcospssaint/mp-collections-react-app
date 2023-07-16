import { useState } from "react";

import { MidiaVideoComponent, ModalMidiaVideo } from '../../components';

import { IMidiaVideoKV } from '../../entities';
import { TV_TOKUSATSU } from "../../entities/midia-video";

export const TVTokusatsu = () => {
    const [tvTokusatsuSelected, setTvTokusatsuSelected] = useState<IMidiaVideoKV>();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const onClickMore = (tvTokusatsu: IMidiaVideoKV) => {
        setTvTokusatsuSelected(tvTokusatsu);
        setIsModalOpen(true);
    }

    const hideModal = () => {
        setIsModalOpen(false);
    };

    return (<>
        <MidiaVideoComponent
            title='TV Tokusatsu'
            type={TV_TOKUSATSU}
            isWatcher={true}
            isOwned={true}
            onClickMore={onClickMore}
        />

        <ModalMidiaVideo midiaVideo={tvTokusatsuSelected} typeMidiaVideo={TV_TOKUSATSU} isModalOpen={isModalOpen} hideModal={hideModal} />
    </>)
};