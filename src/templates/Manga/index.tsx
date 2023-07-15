import React, { useState } from 'react';

import { MidiaLeituraComponent, ModalMidiaLeitura } from '../../components';
import { IMidiaLeituraKV, MANGAS } from '../../entities';

import { useNavigate } from "react-router-dom";

export const Manga: React.FC = () => {
    const navigate = useNavigate();

    const [mangaSelected, setmangaSelected] = useState({} as IMidiaLeituraKV);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const onClick = (manga: IMidiaLeituraKV) => {
        if (!!manga.key.collection) {
            navigate('/mangas/' + manga.key.id, {
                state: manga
            });
        } else {
            setmangaSelected(manga);
            setIsModalOpen(true);
        }
    }

    const hideModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <MidiaLeituraComponent
                title='Mangas'
                type={MANGAS}
                onClickMore={onClick}
            />

            <ModalMidiaLeitura midiaLeitura={mangaSelected} isModalOpen={isModalOpen} hideModal={hideModal}  />
        </>
    )
}