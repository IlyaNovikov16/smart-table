import { createComparison, defaultRules } from "../lib/compare.js";

export function initFiltering(elements, indexes) {
    // #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        const select = elements[elementName];
        if (select) {
            // Очищаем select от возможных старых опций (кроме первой, если есть "—")
            select.innerHTML = '';
            // Добавляем опцию по умолчанию
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '—';
            select.appendChild(defaultOption);
            // Добавляем опции из индекса
            Object.values(indexes[elementName]).forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                select.appendChild(option);
            });
        }
    });

    // #4.3 — настроить компаратор (создаём функцию сравнения с правилами по умолчанию)
    const compare = createComparison(defaultRules);

    return (data, state, action) => {
        // #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const field = action.dataset.field; // например, 'date', 'customer', 'seller', 'total'
            // Ищем ближайший родительский элемент с классом filter-wrapper (или label)
            const wrapper = action.closest('.filter-wrapper, label');
            if (wrapper) {
                const input = wrapper.querySelector('input');
                if (input) {
                    input.value = '';
                    // Также сбрасываем соответствующее поле в state (если нужно)
                    // Но state – это копия, изменения не повлияют на форму.
                    // Вместо этого можно вызвать событие change на input, чтобы обновилась форма.
                    const changeEvent = new Event('change', { bubbles: true });
                    input.dispatchEvent(changeEvent);
                }
            }
        }

        // #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    };
}