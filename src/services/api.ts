interface Response {
    data: {
        user: {
            name?: string;
        };
    };
}

export function post(user: any): Promise<Response> {
    const {
        REACT_APP_USERNAME
    } = process.env;

    return new Promise((resolve) => {
        if (user?.name === REACT_APP_USERNAME) {
            setTimeout(() => {
                resolve({
                    data: {
                        user: {
                            name: user?.name,
                        },
                    },
                });
            }, 500);
        }
    });
}