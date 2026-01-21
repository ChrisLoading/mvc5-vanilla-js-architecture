// 狀態正規化與推導：多語/同義詞收斂 → pending/review/approved/rejected 四態
const trimAll = s => String(s ?? '').replace(/\s+/g, '').trim();

export function mapLabelToCode(label) {
    const s = trimAll(label);
    if (['簽核完成','簽核完畢','已覆核','核准','核可','approved'].includes(s)) {
        return 'approved';
    }
    if (['退回','已退回','rejected'].includes(s)) {
        return 'rejected';
    }
    if (['審核中','覆核中','review'].includes(s)) {
        return 'review';
    }
    return 'pending';
}

/**
 * @param {PR} rec
 * @returns {'pending'|'review'|'approved'|'rejected'}
 */

// 整體覆核狀態推導：先看頂層，再看逐關 approvers[]
export function deriveOverall(rec) {
    const top = mapLabelToCode(rec?.approveStatus || rec?.status || '');
    if (top === 'approved' || top === 'rejected') {
        return top;
    }

    const ap = Array.isArray(rec?.approvers) ? rec.approvers : [];
    if (ap.length) {
        const codes = ap.map(
            a => mapLabelToCode(a?.approveStatus)
        );
        if (codes.includes('rejected')) {
            return 'rejected';
        }
        const done = codes.length > 0 && codes.every(c => c === 'approved');
        if (done) {
            return 'approved';
        };
        // 有人簽了但未全簽 → review；完全沒進度 → pending
        const any = codes.some(c => c === 'approved' || c === 'review');
        return any ? 'review' : 'pending';
    }
    return "pending";
}

export function codeToDisplay(code) {
    return ({ pending:'未覆核', review:'審核中', approved:'簽核完成', rejected:'退回' })[code] || '未覆核';
}