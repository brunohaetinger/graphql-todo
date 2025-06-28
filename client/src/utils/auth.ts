export const logout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/';
}

export const isAuthenticated = () => {
    return Boolean(localStorage.getItem('accessToken'));
}
