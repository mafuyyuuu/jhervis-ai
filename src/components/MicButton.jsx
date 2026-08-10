import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTrackToggle } from '@livekit/components-react';
import { Track } from 'livekit-client';
import './MicButton.css';

// Custom mic control. Deliberately NOT LiveKit's <ControlBar>: that renders
// its own `lk-button` DOM which we could only reach through an !important
// cascade (and its TrackToggle skips the first render entirely), which is what
// kept leaving the mic invisible/mis-sized. useTrackToggle gives us the same
// behavior with no markup of its own.
// `ref` is taken as a plain prop (React 19 — no forwardRef needed) and points
// at the real <button>, so the Space-bar shortcut can click it directly
// instead of doing a global document.querySelector for LiveKit's markup.
const MicButton = ({ onEnabled, ref }) => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deviceError, setDeviceError] = useState(null);

    const { toggle, enabled, pending } = useTrackToggle({
        source: Track.Source.Microphone,
        onDeviceError: (e) => setDeviceError(e),
    });

    const handleClick = useCallback(() => {
        setDeviceError(null);
        if (enabled) {
            // Turning off needs no confirmation.
            toggle(false);
        } else {
            setConfirmOpen(true);
        }
    }, [enabled, toggle]);

    const handleConfirm = useCallback(async () => {
        setConfirmOpen(false);
        try {
            await toggle(true);
            onEnabled?.();
        } catch (e) {
            setDeviceError(e);
        }
    }, [toggle, onEnabled]);

    useEffect(() => {
        if (!confirmOpen) return;
        const onKey = (e) => {
            if (e.key === 'Escape') setConfirmOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [confirmOpen]);

    return (
        <>
            <button
                ref={ref}
                type="button"
                className={`mic-button ${enabled ? 'is-on' : ''}`}
                onClick={handleClick}
                disabled={pending}
                aria-pressed={enabled}
                aria-label={enabled ? 'Turn microphone off' : 'Turn microphone on'}
                title={enabled ? 'Mic on — click to mute' : 'Click to talk'}
            >
                <i className={enabled ? 'ri-mic-line' : 'ri-mic-off-line'}></i>
            </button>

            {deviceError && (
                <div className="mic-error" role="alert">
                    Microphone blocked. Allow mic access in your browser settings, then try again.
                </div>
            )}

            {confirmOpen && createPortal(
                <div className="mic-confirm-backdrop" onClick={() => setConfirmOpen(false)}>
                    <div
                        className="mic-confirm"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="mic-confirm-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h4 id="mic-confirm-title">Enable microphone?</h4>
                        <p>
                            Your audio is streamed live so JHERVIS can hear and answer you.
                            It is <strong>never recorded or stored</strong>, and you can turn
                            the mic off again at any time.
                        </p>
                        <div className="mic-confirm-actions">
                            <button
                                type="button"
                                className="mic-confirm-btn secondary"
                                onClick={() => setConfirmOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="mic-confirm-btn primary"
                                onClick={handleConfirm}
                            >
                                Enable mic
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default MicButton;
