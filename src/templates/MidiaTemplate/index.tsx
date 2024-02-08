import { useState } from 'react';

import { useNavigate } from "react-router-dom";
import { MidiaComponent, ModalMidiaLeitura, ModalMidiaVideo } from '../../components';
import { LEITURA } from '../../entities/midia-leitura';
import { VIDEO } from '../../entities/midia-video';
import { titleByTYPE } from '../../entities/midia';

interface MidiaTemplateProps {
    title: string;
    typeMidia: string;
    type: string;
}

export const MidiaTemplate = ({
    title,
    typeMidia,
    type
}: MidiaTemplateProps) => {
    const navigate = useNavigate();

    const [midiaSelected, setMidiaSelected] = useState({});

    const [isModalOpen, setIsModalOpen] = useState(false);

    const onClickMore = (midia: any) => {
        const URL = window.location.hash.replace('#', '').split('?');

        console.log('midia.key', midia.key)

        if (midia.key?.collection === true) {
            navigate(URL.at(0) + '/'+ midia.key.id + '/collection', {
                state: midia
            });
        } else {
            navigate(URL.at(0) + '/'+ midia?.key.id, {
                state: midia
            });
            setMidiaSelected(midia);
            //setIsModalOpen(true);
        }
    }

    const hideModal = () => {
        setIsModalOpen(false);
    };

    return (<>
        <MidiaComponent
            title={titleByTYPE(typeMidia, type)}
            typeMidia={typeMidia}
            type={type}
            onClickMore={onClickMore}
        />

        {
            typeMidia === VIDEO && 
                <ModalMidiaVideo
                    midiaVideo={midiaSelected}
                    typeMidiaVideo={type}
                    isModalOpen={isModalOpen}
                    hideModal={hideModal} />
        }

        {
            typeMidia === LEITURA && 
                <ModalMidiaLeitura
                    midiaLeitura={midiaSelected}
                    isModalOpen={isModalOpen}
                    hideModal={hideModal} />
        }
    </>)
};