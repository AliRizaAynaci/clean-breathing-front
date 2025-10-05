import { useCallback, useEffect, useMemo, useState } from 'react';

const DEFAULT_API_BASE_URL = 'https://clean-breathing-710737072c4d.herokuapp.com';

export const useGoogleAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiBaseUrl = useMemo(
        () => process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE_URL,
        []
    );

    const fetchCurrentUser = useCallback(async () => {
        setLoading(true);

        try {
            const response = await fetch(`${apiBaseUrl}/me`, {
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status !== 401) {
                    console.warn(`Backend /me endpoint returned ${response.status}. User will remain logged out.`);
                }

                setUser(null);
                setError(null);
                return;
            }

            const data = await response.json();
            setUser(data);
            setError(null);
        } catch (err) {
            // Network error or backend not available - silently fail and keep user logged out
            console.warn('Backend authentication service unavailable:', err.message);
            setError(null); // Don't show error to user if backend is just not running
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [apiBaseUrl]);

    const handleGoogleLogin = useCallback(() => {
        window.location.href = `${apiBaseUrl}/auth/google/login`;
    }, [apiBaseUrl]);

    const handleLogout = useCallback(async () => {
        setLoading(true);

        try {
            await fetch(`${apiBaseUrl}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (err) {
            console.error('Çıkış yapılırken hata oluştu:', err);
        } finally {
            setUser(null);
            setLoading(false);
        }
    }, [apiBaseUrl]);

    useEffect(() => {
        let isMounted = true;

        const syncUserFromBackend = async () => {
            setLoading(true);

            try {
                const url = new URL(window.location.href);
                const params = url.searchParams;
                const hasAuthParams = ['code', 'state', 'authSuccess', 'session'].some((param) =>
                    params.has(param)
                );

                // Inline the fetch logic to avoid dependency issues
                try {
                    console.log('[Auth Debug] Checking user authentication...');
                    console.log('[Auth Debug] API URL:', `${apiBaseUrl}/me`);
                    console.log('[Auth Debug] Current cookies:', document.cookie);
                    
                    const response = await fetch(`${apiBaseUrl}/me`, {
                        credentials: 'include',
                        headers: {
                            'Accept': 'application/json',
                        },
                    });

                    console.log('[Auth Debug] Response status:', response.status);
                    console.log('[Auth Debug] Response headers:', [...response.headers.entries()]);

                    if (!response.ok) {
                        if (response.status !== 401) {
                            console.warn(`Backend /me endpoint returned ${response.status}. User will remain logged out.`);
                        } else {
                            console.log('[Auth Debug] User not authenticated (401)');
                        }
                        if (isMounted) {
                            setUser(null);
                            setError(null);
                        }
                    } else {
                        const data = await response.json();
                        console.log('[Auth Debug] User data received:', data);
                        if (isMounted) {
                            setUser(data);
                            setError(null);
                        }
                    }
                } catch (err) {
                    console.error('[Auth Debug] Fetch failed:', err.message);
                    console.warn('Backend authentication service unavailable:', err.message);
                    if (isMounted) {
                        setError(null);
                        setUser(null);
                    }
                }

                if (isMounted && hasAuthParams) {
                    params.delete('code');
                    params.delete('state');
                    params.delete('authSuccess');
                    params.delete('session');
                    window.history.replaceState({}, document.title, url.pathname + (params.toString() ? `?${params}` : ''));
                }
            } catch (err) {
                console.error('Error during auth initialization:', err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        syncUserFromBackend();

        return () => {
            isMounted = false;
        };
    }, [apiBaseUrl]); // Only depend on apiBaseUrl which is memoized

    return {
        user,
        loading,
        error,
        handleGoogleLogin,
        handleLogout,
        refreshUser: fetchCurrentUser,
    };
};
