import { PRRepo } from "./PRRepo.js"; 

const KEY_PR_NEW = 'pr_records_green';   // 新版
const KEY_PR_OLD = 'pr_records';         // 舊版相容

function loadByKey(k) { 
    try { 
        return JSON.parse(localStorage.getItem(k) || '[]'); 
    } catch { 
        return []; 
    }
} 

// 客製：回傳 ISO 字串或空字串；避免 Date.parse NaN
function toIsoOrEmpty(s) {
    const d = new Date(s);
    return isNaN(+d) ? '' : d.toISOString();
  }

export class LocalPRRepo extends PRRepo {
    /** @returns {PR[]} */
    _loadAll() {
        const map = new Map(); // key: prNo → value: record（取 createdAt 較新者留下）
        [...loadByKey(KEY_PR_OLD), ...loadByKey(KEY_PR_NEW)].forEach(
            r => {
                const key = (r?.prNo || '').trim();
                if (!key) return;
                const cur = map.get(key);
                const t = Date.parse(r?.createdAt ?? 0);
                const tc = Date.parse(cur?.createdAt ?? 0);
                if (!cur || (isFinite(t) && (!isFinite(tc) || t >= tc)))
                    map.set(key, {
                        ...r, 
                        createdAt: toIsoOrEmpty(r.createdAt)
                    });
            }
        )
        return [...map.values()];
    }

    async list(opts={}) {
        const all = this._loadAll();
        return {
            items: all,
            total: all.length, 
            page: 1,
            pageSize: all.length
        };
    }

    async get(prNo) {
        const rec = this._loadAll().find(x => String(x.prNo) === String(prNo));
        if (!rec) throw new Error('PR not found: ' + prNo);
        return rec;
    }
}

