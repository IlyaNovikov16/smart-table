import './fonts/ys-display/fonts.css';
import './style.css';

import { data as sourceData } from "./data/dataset_1.js";
import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";
import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

const api = initData(sourceData);

function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage, 10);
    const page = parseInt(state.page ?? 1, 10);
    return { ...state, rowsPerPage, page };
}

let applySearching = null;
let applyFiltering = null;
let updateIndexes = null;
let applySorting = null;

async function render(action) {
    let state = collectState();
    let query = {};

    if (applySearching) query = applySearching(query, state, action);
    if (applyFiltering) query = applyFiltering(query, state, action);
    if (applySorting) query = applySorting(query, state, action);
    query = applyPagination(query, state, action);

    const { total, items } = await api.getRecords(query);
    updatePagination(total, query);
    sampleTable.render(items);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

const { applyPagination, updatePagination } = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

applySearching = initSearching('search');
applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

sampleTable.container.addEventListener('click', (event) => {
    const button = event.target.closest('button[name="clear"]');
    if (!button) return;

    event.preventDefault();
    const fieldName = button.dataset.field;
    const filterElements = sampleTable.filter.elements;
    
    const input = Object.values(filterElements).find(el => el.name === fieldName);
    if (input) {
        input.value = '';
        render();
    }
});

async function init() {
    const indexes = await api.getIndexes();
    const filtering = initFiltering(sampleTable.filter.elements);
    applyFiltering = filtering.applyFiltering;
    updateIndexes = filtering.updateIndexes;
    updateIndexes({ searchBySeller: indexes.sellers });
    render();
}

init();