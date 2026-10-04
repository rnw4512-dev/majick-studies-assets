(() => {
    function currentScene() {
        try { return window.majickPhaserGame?.scene?.getScene('Game') || null; }
        catch (_) { return null; }
    }
    function apply(state) {
        window.majickPendingState = state || null;
        const s = currentScene();
        if (s && s.scene && s.scene.isActive() && typeof s.applyStudyState === 'function') s.applyStudyState(state);
    }
    window.addEventListener('message', event => {
        const data = event.data || {};
        if (data.type === 'MAJICK_STATE') apply(data.payload || null);
    });
    function ready() {
        if (window.parent && window.parent !== window) window.parent.postMessage({ type: 'MAJICK_SANCTUARY_READY' }, '*');
    }
    window.addEventListener('load', () => { ready(); setTimeout(ready, 900); });
})();
