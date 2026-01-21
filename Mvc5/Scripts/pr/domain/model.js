import { deriveOverall } from "./status.js";

/** 去重：以 prNo key，較新 createdAt 覆蓋舊資料 */
export function dedupeByPrNo(records) {
    const map = new Map();
    for (const r of records) {
        const key = (r?.prNo || '').trim();
        if (!key) continue;

        const prev = map.get(key);
        const t = Date.parse(r?.createdAt ?? 0);
        const tp = Date.parse(prev?.CreatedAt ?? 0);
        if (!prev || (isFinite(t) && (!isFinite(tp) || t >= tp))) {
            map.set(key, r);
        }
    }
    return [...map.values()];
}

export function spiltByStatus(records) {
    const P = [], // pending 
            A = [], // approved
            R = [], // rejected
            V = []; // review
    for (const r of records) {
        const st = deriveOverall(r);
        if (st === 'approved') {
            A.push(r);
        } else if (st === 'rejected') {
            R.push(r);
        } else if (st === 'review') {
            V.push(r);
        } else {
            P.push(r);
        }
    }
    return { pending: P, approved: A, rejected: R, review: V };
}

export function sortByPrNoDesc(records) {
    // PR2025-0001 → 以年份/流水號作穩定排序（fallback 到字串）
    const re = /(\d{4})[^\d]*(\d{1,6})$/; // 抓年份與末尾流水號
    return [...records].sort(
        (a, b) => {
            const A = String(a.prNo || '');
            const B = String(b.prNo || '');
            const ma = A.match(re);
            const mb = B.match(re);
            if (ma && mb) {
                const ya = +ma[1], yb = +mb[1];
                if (ya !== yb) {
                    return yb - ya; // 年份較大在前，降冪排序
                }
                const sa = +ma[2], sb = +mb[2];
                return sb - sa; // 流水號較大在前，降冪排序
            }
            return B.localeCompare(A); // 字串降冪排序，(B在前 == 降冪)
        }
    )
}

export function filterByText(records, q) { 
    if (!q) {
        return records;
    }
    const s = q.trim().toLowerCase();
    return records.filter(
        r => JSON.stringify(r).toLowerCase().includes(s)
    );
}