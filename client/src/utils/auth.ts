export const saveToken = (token: string) => {
    localStorage.setItem('token', token);
}

export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
}

export const isAuthenticated = () => {
    return Boolean(localStorage.getItem('token'));
}