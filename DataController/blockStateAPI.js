import blockState from '../Data/blocksState'

class StateAPI {
    static changeValue(keys, newValue, state=blockState) {
        if (keys.length === 0) return;

        let k = keys.shift();
        Object.entries(state).map(([key, value]) => {
            if (key === k) {
                if (keys.length === 0) {
                    alert(value.value)
                    value.value = newValue;
                }

                return this.changeValue(keys, newValue, value.content);
            }
        })
    }
}

export { StateAPI }
