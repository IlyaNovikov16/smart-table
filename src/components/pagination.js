import { getPages } from "../lib/utils.js";

export const initPagination = ({ pages, fromRow, toRow, totalRows, firstPage, previousPage, nextPage, lastPage }, createPage) => {
    // #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.innerHTML = ''; // очищаем контейнер

    return (data, state, action) => {
        // #2.1 — посчитать количество страниц, объявить переменные и константы
        const rowsPerPage = state.rowsPerPage;
        const pageCount = Math.ceil(data.length / rowsPerPage);
        let page = state.page;

        // #2.6 — обработать действия (кнопки пагинации)
        if (action === firstPage) page = 1;
        else if (action === previousPage) page = Math.max(1, page - 1);
        else if (action === nextPage) page = Math.min(pageCount, page + 1);
        else if (action === lastPage) page = pageCount;
        // если action === undefined или другая кнопка — страница остаётся текущей

        // #2.5 — обновить статус пагинации (счётчики и состояние кнопок)
        const startRow = (page - 1) * rowsPerPage + 1;
        const endRow = Math.min(page * rowsPerPage, data.length);
        if (fromRow) fromRow.textContent = startRow;
        if (toRow) toRow.textContent = endRow;
        if (totalRows) totalRows.textContent = data.length;

        if (firstPage) firstPage.disabled = (page === 1);
        if (previousPage) previousPage.disabled = (page === 1);
        if (nextPage) nextPage.disabled = (page === pageCount);
        if (lastPage) lastPage.disabled = (page === pageCount);

        // #2.4 — получить список видимых страниц и вывести их
        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNumber, pageNumber === page);
        }));

        // #2.2 — посчитать сколько строк нужно пропустить и получить срез данных
        const skip = (page - 1) * rowsPerPage;
        return data.slice(skip, skip + rowsPerPage);
    };
};