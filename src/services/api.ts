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
        var usernames = REACT_APP_USERNAME?.split(',');

        usernames?.forEach((u) => {
            if (user?.name === u) {
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
    });
}