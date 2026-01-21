import { renderTable, renderDetailDialog } from "./render.js";
import { dedupeByPrNo, spiltByStatus, sortByPrNoDesc, filterByText} from "../domain/model.js";

// 小工具：簡易 debounce
export function debounce(fn, ms=250) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => {
            fn(...args);
        }, ms);
    }
}

export function bindTableFilter(inputSel, tableSel) {
    const box = document.querySelector(inputSel);
    const tbody = document.querySelector(`${tableSel} tbody`);
    if(!box || !tbody) return;

    const apply = () => {
        const q = box.value || '';
        [...tbody.rows].forEach(tr => {
            tr.style.display = tr.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none';
        });
    };
    box.addEventListener('input', debounce(apply, 200));
}

export function bindDetailButtons(tableSel, onOpen) {
    document.querySelector(tableSel)?.addEventListener('click', e => {
        const btn = e.target.closest('button[data-act="detail"]');    
        if(!btn) return;

        onOpen(btn.dataset.no);
    });
}

export function openDialog(id) {
    document.getElementById(id)?.showModal();
}

export function closeDialog(id) {
    document.getElementById(id)?.close();
}

export function repaintTables(sourceRecords) {
    const uniq = dedupeByPrNo(sourceRecords);
    const groups = spiltByStatus(uniq);
    
    const P = sortByPrNoDesc(groups.pending);
    const R = sortByPrNoDesc(groups.review);
    const A = sortByPrNoDesc(groups.approved);

    // 可決定是否把「審核中」獨立一張表；這裡先把 A 區顯示 pending+review 合併
    renderTable('#tblA tbody',[...P, ...R]);
    renderTable('#tblB tbody',A);
}

export async function WirePage({repo}) {
    // 初始 render
    const resp = await repo.list({});
    repaintTables(resp.items);

    // 篩選框
    bindTableFilter('#filterA', '#tblA');
    bindTableFilter('#filterB', '#tblB');

    // 重新整理
    document.getElementById('btnRefreshA')?.addEventListener('click', async () => {
        const r = await repo.list({});
        repaintTables(r.items);
    });
    document.getElementById('btnRefreshB')?.addEventListener('click', async () => {
        const r = await repo.list({});
        repaintTables(r.items);
    });

    // 詳情按鈕
    const openDetail = async (prNo) => {
        const rec = await repo.get(prNo);
        renderDetailDialog(rec);
        openDialog('detailDlg');
    };
    bindDetailButtons('#tblA', openDetail);
    bindDetailButtons('#tblB', openDetail);

    document.getElementById('detailCloseBtn')?.addEventListener('click', () => {
        closeDialog('detailDlg');
    });
}