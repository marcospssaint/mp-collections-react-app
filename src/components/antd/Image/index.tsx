import { Image as ImageAntd } from 'antd';

const IMG_DEFAULT = process.env.PUBLIC_URL + '/imagens/imgDefault.png';

interface ImageProps {
    src?: string | undefined;
    witdh?: number;
    height?: number;
    preview?: boolean;
}

export const Image = ({ src = IMG_DEFAULT, witdh, height = 200, preview = false }: ImageProps) => (
    <ImageAntd
        width={witdh}
        height={height}
        src={src}
        preview={preview}
        style={{ width: '100%' }} />
);