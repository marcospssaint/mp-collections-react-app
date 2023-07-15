import React, { useState } from 'react';

import { MidiaLeituraComponent, ModalMidiaLeitura } from '../../components';
import { COMICS, IMidiaLeituraKV } from '../../entities';

import { useNavigate } from "react-router-dom";

export const Comic: React.FC = () => {
    const navigate = useNavigate();

    const [comicSelected, setComicSelected] = useState({} as IMidiaLeituraKV);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const onClick = (comic: IMidiaLeituraKV) => {
        if (!!comic.key.collection) {
            navigate('/comics/' + comic.key.id, {
                state: comic
            });
        } else {
            setComicSelected(comic);
            setIsModalOpen(true);
        }
    }

    const hideModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <MidiaLeituraComponent
                title='Comics'
                type={COMICS}
                onClickMore={onClick}
            />

            <ModalMidiaLeitura midiaLeitura={comicSelected} isModalOpen={isModalOpen} hideModal={hideModal}  />
        </>
    )
}