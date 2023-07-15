import React, { useState } from 'react';

import { MidiaLeituraComponent, ModalMidiaLeitura } from '../../components';
import { BOOKS, IMidiaLeituraKV } from '../../entities';

import { useNavigate } from "react-router-dom";

export const Book: React.FC = () => {
    const navigate = useNavigate();

    const [bookSelected, setbookSelected] = useState({} as IMidiaLeituraKV);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const onClick = (book: IMidiaLeituraKV) => {
        if (!!book.key.collection) {
            navigate('/books/' + book.key.id, {
                state: book
            });
        } else {
            setbookSelected(book);
            setIsModalOpen(true);
        }
    }

    const hideModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <MidiaLeituraComponent
                title='Books'
                type={BOOKS}
                onClickMore={onClick}
            />

            <ModalMidiaLeitura midiaLeitura={bookSelected} isModalOpen={isModalOpen} hideModal={hideModal} />
        </>
    )
}