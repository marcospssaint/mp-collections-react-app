
import { useNavigate } from "react-router-dom";
import { MidiaComponent } from '../../components';
import { titleByTYPE } from '../../entities/midia';

interface MidiaTemplateProps {
    typeMidia: string;
    type: string;
}

export const MidiaTemplate = ({
    typeMidia,
    type
}: MidiaTemplateProps) => {
    const navigate = useNavigate();

    const onClickMore = (midia: any) => {
        const URL = window.location.hash.replace('#', '').split('?');

        if (midia.key?.collection === true) {
            navigate(URL.at(0) + '/' + midia.key.id + '/collection', {
                state: midia
            });
        } else {
            navigate(URL.at(0) + '/' + midia?.key.id, {
                state: midia
            });
        }
    }

    return <MidiaComponent
        title={titleByTYPE(typeMidia, type)}
        typeMidia={typeMidia}
        type={type}
        onClickMore={onClickMore}
    />
};