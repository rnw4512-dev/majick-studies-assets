(() => {
    function currentScene() {
        try { return window.majickPhaserGame?.scene?.getScene('Game') || null; }
        catch (_) { return null; }
    }
    function apply(state) {
        window.majickPendingState = state || null;
        const scene = currentScene();
        if (scene?.scene?.isActive() && typeof scene.applyStudyState === 'function') scene.applyStudyState(state);
    }
    window.addEventListener('message', event => {
        if (event.origin !== location.origin) return;
        const data = event.data || {};
        if (data.type === 'MAJICK_STATE') apply(data.payload || null);
        if (data.type === 'MAJICK_SANCTUARY_ROSTER_REQUEST_V3350') {
            const scene = currentScene();
            if (scene?.scene?.isActive()) {
                scene.v3348SyncRoster?.();
            }
        }
    });
    function ready() {
        const scene = currentScene();
        if (!scene?.scene?.isActive()) return false;
        const note = document.getElementById('phaser-load-note');
        if (note) note.style.display = 'none';
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'MAJICK_SANCTUARY_READY' }, location.origin);
            window.parent.postMessage({ type: 'MAJICK_SANCTUARY_READY_V3317' }, location.origin);
            window.parent.postMessage({ type: 'MAJICK_SANCTUARY_ROSTER_V3350', rows: window.MajickSanctuaryRoster?.inspect?.(scene)?.roster || [] }, location.origin);
        }
        return true;
    }
    let checks = 0;
    const poll = setInterval(() => {
        checks++;
        if (ready() || checks >= 100) clearInterval(poll);
        if (checks === 100 && !currentScene()?.scene?.isActive()) {
            const note = document.getElementById('phaser-load-note');
            if (note) {
                note.style.zIndex = '3';
                note.innerHTML = '<span role="alert">Sanctuary could not finish loading. <button type="button" id="majick-retry-room">Retry room</button></span>';
                document.getElementById('majick-retry-room')?.addEventListener('click', () => location.reload());
            }
        }
    }, 200);
    window.addEventListener('load', ready);
})();
