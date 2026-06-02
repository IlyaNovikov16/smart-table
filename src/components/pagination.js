import { getPages } from "../lib/utils.js";

export const initPagination = ({ pages, fromRow, toRow, totalRows, firstPage, previousPage, nextPage, lastPage }, createPage) => {
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.innerHTML = '';
    let pageCount;

    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        if (action === firstPage) page = 1;
        else if (action === previousPage) page = Math.max(1, page - 1);
        else if (action === nextPage) page = Math.min(pageCount, page + 1);
        else if (action === lastPage) page = pageCount;

        return { ...query, limit, page };
    };

    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit);

        const startRow = (page - 1) * limit + 1;
        const endRow = Math.min(page * limit, total);
        if (fromRow) fromRow.textContent = startRow;
        if (toRow) toRow.textContent = endRow;
        if (totalRows) totalRows.textContent = total;

        if (firstPage) firstPage.disabled = (page === 1);
        if (previousPage) previousPage.disabled = (page === 1);
        if (nextPage) nextPage.disabled = (page === pageCount);
        if (lastPage) lastPage.disabled = (page === pageCount);

        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNumber, pageNumber === page);
        }));
    };

    return { applyPagination, updatePagination };
};