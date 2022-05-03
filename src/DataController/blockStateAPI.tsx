import blockState from '../Data/blocksState'

class StateAPI {
    static changeValue(keys: Array<string | number>, 
        newValue: string | number | boolean  | null, state=blockState) {
        if (keys.length === 0) return;

        const k = keys.shift();
        Object.entries(state).map(([key, value]: [string | number, any]) => {
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
