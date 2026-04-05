import { useState, useEffect } from "react";

export const usePresetLoader = (presetId) => {
    const [preset, setPreset] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!presetId) return;

        const loadPreset = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/presets/${presetId}.json`);
                if (!response.ok) {
                    throw new Error(`Failed to load preset: ${presetId}`);
                }
                const presetData = await response.json();
                setPreset(presetData);
            } catch (err) {
                console.error("Error loading preset:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadPreset();
    }, [presetId]);

    return { preset, loading, error };
};
