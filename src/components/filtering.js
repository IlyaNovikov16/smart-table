export function initFiltering(elements) {
    const updateIndexes = (indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            const el = elements[elementName];
            if (el) {
                const firstOption = el.firstElementChild;
                el.innerHTML = '';
                el.appendChild(firstOption);

                const options = Object.values(indexes[elementName]).map(name => {
                    const el = document.createElement('option');
                    el.textContent = name;
                    el.value = name;
                    return el;
                });
                el.append(...options);
            }
        });
    };

    const applyFiltering = (query, state, action) => {
        if (action && action.name === 'clear') {
            const input = action.parentElement.querySelector('input');
            if (input) {
                input.value = '';
                delete state[input.dataset.name];
            }
        }

        const filter = {};
        Object.keys(elements).forEach(key => {
            const el = elements[key];
            if (el && el.value !== '') {
                filter[`filter[${el.name}]`] = el.value;
            }
        });

        return { ...query, ...filter };
    };

    return { updateIndexes, applyFiltering };
}