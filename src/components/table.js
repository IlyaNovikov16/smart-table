import {cloneTemplate} from "../lib/utils.js";

export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 — вывести дополнительные шаблоны до и после таблицы
    // #1.2 — вывести дополнительные шаблоны до и после таблицы
    // Добавляем шаблоны "до" таблицы (before) в обратном порядке через prepend
    if (before && Array.isArray(before)) {
        [...before].reverse().forEach(subName => {
            root[subName] = cloneTemplate(subName);               // клонируем и сохраняем в root
            root.container.prepend(root[subName].container);      // добавляем в начало контейнера
        });
    }

    // Добавляем шаблоны "после" таблицы (after) в обычном порядке через append
    if (after && Array.isArray(after)) {
        after.forEach(subName => {
            root[subName] = cloneTemplate(subName);               // клонируем и сохраняем в root
            root.container.append(root[subName].container);       // добавляем в конец контейнера
        });
    }
    // @todo: #1.3 — обработать события и вызвать onAction()
        // #1.3 — обработать события и вызвать onAction()
    if (root.container) {
        // Обработчик события change (изменение полей ввода, select и т.д.)
        root.container.addEventListener('change', () => {
            onAction();  // вызов без аргументов
        });

        // Обработчик события reset (сброс формы)
        root.container.addEventListener('reset', (e) => {
            // Отложенный вызов, чтобы поля успели очиститься
            setTimeout(() => onAction(), 0);
        });

        // Обработчик события submit (отправка формы)
        root.container.addEventListener('submit', (e) => {
            e.preventDefault();  // предотвращаем реальную отправку формы
            // Передаём кнопку, которая вызвала submit (e.submitter)
            onAction(e.submitter);
        });
    }
    const render = (data) => {
        // #1.1 — преобразовать данные в массив строк
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            Object.keys(item).forEach(key => {
                if (row.elements[key]) {
                    row.elements[key].textContent = item[key];
                }
            });
            return row.container; // или row, зависит от cloneTemplate
        });
        root.elements.rows.replaceChildren(...nextRows);
    };

    // Возвращаем объект, который ожидает main.js
    return { ...root, render };
}