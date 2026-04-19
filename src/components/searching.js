import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
    // #5.1 — настроить компаратор
    const compare = createComparison([
        { skipEmptyTargetValues: true },                                        // если строка поиска пуста — пропустить
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false) // искать по трём полям
    ]);

    return (data, state, action) => {
        // #5.2 — применить компаратор
        return data.filter(row => compare(row, state));
    };
}