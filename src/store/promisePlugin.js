const promisePlugin = store => {
    // 当 store 初始化后调用
    store.subscribe((mutation) => {
        // 每次 mutation 之后调用
        // mutation 的格式为 { type, payload }
        if (isPromise(mutation.payload)) {
            store.commit('common/setLoading', true);
            mutation.payload.then(
                res => {
                    store.commit('common/setLoading', false);
                    if (res.msg === 'OK' || !res.msg) {
                        store.commit(mutation.type, res);
                    }
                    else {
                        store.commit('common/error', res);
                    }
                }
            );
        }
    })
}

function isPromise(v) {
    return v && typeof v.then === 'function';
}

export default promisePlugin;