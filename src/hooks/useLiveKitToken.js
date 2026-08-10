import { useCallback, useEffect, useState } from 'react';

/* Fetches the LiveKit access token *without* the portfolio waiting on it.

   This used to be an un-timed, un-retried fetch whose only failure handling was
   console.error, while App refused to render anything but a spinner until it
   resolved. Any hiccup — a cold serverless function, a corporate proxy, the
   token server being down — left a visitor staring at "INITIALIZING NEURAL
   LINK..." forever with the actual portfolio (projects, resume, contact links)
   unreachable behind it. The AI is an enhancement; it must never be able to
   take the document down with it. */

const REQUEST_TIMEOUT_MS = 10000;
const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 1200;

// A LiveKit token is a JWT. Guard against a proxy or Vercel error page being
// handed to the client as a "token", which otherwise surfaces much later as an
// opaque connection failure inside livekit-client.
const looksLikeJwt = (value) => typeof value === 'string' && value.split('.').length === 3;

export function useLiveKitToken(endpoint) {
    const [token, setToken] = useState(null);
    const [status, setStatus] = useState('loading'); // loading | ready | error
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        // Scoped to this effect run, so a slow in-flight attempt from a
        // superseded run (unmount, or a manual retry) can't setState over a
        // newer one.
        let cancelled = false;
        let retryTimer = null;

        setStatus('loading');

        const attempt = async (attemptNumber) => {
            if (cancelled) return;

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

            try {
                const response = await fetch(endpoint, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error(`Token server responded ${response.status}`);
                }

                const body = (await response.text()).trim();
                if (!looksLikeJwt(body)) {
                    throw new Error('Token server did not return a JWT');
                }

                if (cancelled) return;
                setToken(body);
                setStatus('ready');
            } catch (err) {
                if (cancelled) return;

                if (attemptNumber < MAX_ATTEMPTS) {
                    console.warn(
                        `Token fetch attempt ${attemptNumber} failed, retrying:`,
                        err,
                    );
                    retryTimer = setTimeout(
                        () => attempt(attemptNumber + 1),
                        RETRY_BASE_DELAY_MS * attemptNumber,
                    );
                    return;
                }

                console.error('Token fetch failed, continuing without voice:', err);
                setStatus('error');
            } finally {
                clearTimeout(timeout);
            }
        };

        attempt(1);

        return () => {
            cancelled = true;
            if (retryTimer) clearTimeout(retryTimer);
        };
    }, [endpoint, reloadKey]);

    const retry = useCallback(() => setReloadKey((key) => key + 1), []);

    return { token, status, retry };
}
