import { useCallback } from 'react';

export const useGoogleAuth = () => {
    const handleGoogleLogin = useCallback(() => {
        // Backend OAuth endpoint'ine yönlendir
        window.location.href = 'https://clean-breathing-710737072c4d.herokuapp.com/auth/google/login';
    }, []);

    const handleLogout = useCallback(() => {
        // Kullanıcı bilgilerini temizle
        document.getElementById("user-name").textContent = "Kullanıcı";
        document.getElementById("user-avatar").textContent = "K";
        document.getElementById("user-info").classList.add("hidden");
        document.getElementById("login-button").classList.remove("hidden");
        document.getElementById("notification-settings").classList.add("hidden");
    }, []);

    return { handleGoogleLogin, handleLogout };
};
