export function initFiltering(elements) {
    const updateIndexes = (indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            if (elements[elementName]) {
                elements[elementName].innerHTML = ''; // очищаем перед добавлением
                const options = Object.values(indexes[elementName]).map(name => {
                    const el = document.createElement('option');
                    el.textContent = name;
                    el.value = name;
                    return el;
                });
                elements[elementName].append(...options);
            }
        });
    };

    const applyFiltering = (query, state, action) => {
        const filter = {};
        Object.keys(elements).forEach(key => {
            const el = elements[key];
            if (el && ['INPUT', 'SELECT'].includes(el.tagName) && el.value) {
                filter[`filter[${el.name}]`] = el.value;
            }
        });
        return Object.keys(filter).length ? { ...query, ...filter } : query;
    };

    return { updateIndexes, applyFiltering };
}