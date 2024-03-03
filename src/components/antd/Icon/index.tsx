const IMG_FLAG_DEFAULT = process.env.PUBLIC_URL + '/imagens/flags/';

export const IconFlagCountries = (countries: string | undefined) => {
    if (countries !== undefined) {
        let imageFlag;
        switch (countries) {
            case 'Argentina': imageFlag = 'flag-of-argentina.png'; break;
            case 'Belgium': imageFlag = 'flag-of-belgium.png'; break;
            case 'Brazil': imageFlag = 'flag-of-brazil.png'; break;
            case 'China': imageFlag = 'flag-of-china.png'; break;
            case 'France': imageFlag = 'flag-of-france.png'; break;
            case 'Germany': imageFlag = 'flag-of-germany.png'; break;
            case 'Italy': imageFlag = 'flag-of-italian.png'; break;
            case 'Japan': imageFlag = 'flag-of-japan.png'; break;
            case 'Philippines': imageFlag = 'flag-of-philippines.png'; break;
            case 'Singapore': imageFlag = 'flag-of-singapore.png'; break;
            case 'South Korea': imageFlag = 'flag-of-south-korea.png'; break;
            case 'Spain': imageFlag = 'flag-of-spain.png'; break;
            case 'Switzerland': imageFlag = 'flag-of-switzerland.png'; break;
            case 'USA': imageFlag = 'flag-of-usa.png'; break;
            default: imageFlag = '';
        }

        return IMG_FLAG_DEFAULT + imageFlag;
    }
    return '';
}

export const IconFlagLanguage = (language: string | undefined) => {
    if (language !== undefined) {
        let imageFlag;
        switch (language) {
            case 'Argentina': imageFlag = 'flag-of-argentina.png'; break;
            case 'Belgium': imageFlag = 'flag-of-belgium.png'; break;
            case 'Portugues': imageFlag = 'flag-of-brazil.png'; break;
            case 'China': imageFlag = 'flag-of-china.png'; break;
            case 'France': imageFlag = 'flag-of-france.png'; break;
            case 'Germany': imageFlag = 'flag-of-germany.png'; break;
            case 'Italy': imageFlag = 'flag-of-italian.png'; break;
            case 'Japan': imageFlag = 'flag-of-japan.png'; break;
            case 'Philippines': imageFlag = 'flag-of-philippines.png'; break;
            case 'Singapore': imageFlag = 'flag-of-singapore.png'; break;
            case 'South Korea': imageFlag = 'flag-of-south-korea.png'; break;
            case 'Spain': imageFlag = 'flag-of-spain.png'; break;
            case 'Switzerland': imageFlag = 'flag-of-switzerland.png'; break;
            case 'USA': imageFlag = 'flag-of-usa.png'; break;
            default: imageFlag = '';
        }

        return IMG_FLAG_DEFAULT + imageFlag;
    }
    return '';
}