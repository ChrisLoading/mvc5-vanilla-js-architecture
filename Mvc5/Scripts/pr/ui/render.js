import { deriveOverall, codeToDisplay } from "../domain/status.js";

const $ = s => /** @type {HTMLElement} */ document.querySelector(s);

function td(txt, cls) {
    const el = document.createElement('td');
    if (cls) {
        el.className = cls;
    }
    el.textContent = txt ?? '';
    return el;
}

export function renderTable(tbodySel, list) {
    const tbody = $(tbodySel);
    if (!tbody) return;
    tbody.innerHTML = '';

    list.forEach(
        (r, i) => {
            const tr = document.createElement('tr');
            tr.appendChild(td(String(i+1)));
            tr.appendChild(td(r.prNo, 'left'));
            tr.appendChild(td(r.prDate || ''));
            tr.appendChild(td(r.requester || ''));
            tr.appendChild(td(r.dept || ''));
            tr.appendChild(td(String((r.items || []).length)));
            tr.appendChild(td(codeToDisplay(deriveOverall(r))));
            tr.appendChild(td(new Date(r.createdAt||'').toLocaleString() || ''));

            const op = document.createElement('td');
            const btn = document.createElement('button');
            btn.className = 'btn-link';
            btn.dataset.act = 'detail';
            btn.dataset.no = r.prNo || '';
            btn.textContent = '詳情';
            op.appendChild(btn);
            tr.appendChild(op);

            tbody.appendChild(tr);
        }
    );
}

export function renderDetailDialog(rec) {
    const titleEl = document.getElementById('detailTitle');
    const bodyEl = document.getElementById('detailBody');

    if (titleEl) {
        titleEl.textContent = `請購單詳細內容 — ${rec.prNo || ''}`;
    }
    if (bodyEl) {
        bodyEl.innerHTML = '';

        // 頭區塊
        const head = document.createElement('table');
        head.className = 'dlg-grid';
        head.innerHTML = `
            <tbody>
                <tr><th>請購單號</th><td>${rec.prNo||''}</td><th>請購日期</th><td>${rec.prDate||''}</td></tr>
                <tr><th>申請人員</th><td>${rec.requester||''}</td><th>請購部門</th><td>${rec.dept||''}</td></tr>
                <tr><th>覆核狀態</th><td colspan="3">${codeToDisplay(deriveOverall(rec))}</td></tr>
                <tr><th>建檔時間</th><td colspan="3">${new Date(rec.createdAt||'').toLocaleString()||''}</td></tr>
            </tbody>    
        `;
        bodyEl.appendChild(head);

        // 流程
        if(Array.isArray(rec.approvers) && rec.approvers.length){
            const flow = document.createElement('table'); 
            flow.className='dlg-list';
            const tbody = document.createElement('tbody');
            rec.approvers.forEach((a,idx)=>{
                const tr = document.createElement('tr');
                tr.appendChild(td(String(idx+1).padStart(3,'0')));
                tr.appendChild(td(a?.title||''));
                tr.appendChild(td(a?.approver||''));
                tr.appendChild(td(a?.approveDate||''));
                tr.appendChild(td(a?.approveStatus||''));
                tbody.appendChild(tr);
            });
            flow.innerHTML = '<thead><tr><th>#</th><th>職稱</th><th>覆核人員</th><th>覆核日期</th><th>覆核狀態</th></tr></thead>';
            flow.appendChild(tbody);
            bodyEl.appendChild(flow);
        }

        // 品項
        const items = document.createElement('table'); 
        items.className='dlg-list';
        const tb = document.createElement('tbody');
        (rec.items||[]).forEach(it =>{
            const tr = document.createElement('tr');
            tr.appendChild(td(String(it.idx||'')));
            tr.appendChild(td(it.category||''));
            tr.appendChild(td(it.name||'', 'left'));
            tr.appendChild(td(it.spec||'', 'left'));
            tr.appendChild(td(String(it.qty||'')));
            tr.appendChild(td(it.vendor||'', 'left'));
            tb.appendChild(tr);
        });
        if(!(rec.items||[]).length){
            const tr = document.createElement('tr');
            const c = td('（無明細）'); c.colSpan = 6; c.className='muted';
            tr.appendChild(c); tb.appendChild(tr);
        }
        items.innerHTML = '<thead><tr><th>項次</th><th>商品類別</th><th>商品名稱</th><th>規格</th><th>數量</th><th>建議廠商</th></tr></thead>';
        items.appendChild(tb);
        bodyEl.appendChild(items);
    }
}