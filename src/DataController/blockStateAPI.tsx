import blockState from '../Data/blocksState'

class StateAPI {
    static changeName(keys: Array<string | number>, newName: string | number | boolean  | null, state=blockState) {
        if (!keys.length) return;

        const k = keys.shift();
        Object.entries(state).map(([key, value]: [string | number, any]) => {
            if (key === k) {
                if (!keys.length) {
                    value.name = newName;
                }

                return this.changeName(keys, newName, value.content);
            }
        })
    }

    static changeValue(keys: Array<string | number>, newValue: string | number | boolean  | null, state=blockState) {
        if (!keys.length) return;

        let k = keys.shift();
        Object.entries(state).map(([key, value]: [string | number, any]) => {
            if (key === k) {
                if (!keys.length) {
                    value.value = newValue;
                }

                return this.changeValue(keys, newValue, value.content);
            }
        })
    }
}

export { StateAPI }
