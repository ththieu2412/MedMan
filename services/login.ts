export const loginUser = async (username: string, password: string) => {
    const response = await fetch('url.api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password},)
    });
    if (!response.ok) {
        throw new Error('Failed to login');
    }
    return response.json();
};