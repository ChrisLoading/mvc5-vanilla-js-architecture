// 定義「資料介面（port）」：前端其他層只能呼叫這裡的 API
export class PRRepo {
  /** @param {{status?: ('pending'|'review'|'approved'|'rejected'), q?: string, page?: number, pageSize?: number}} opts */
  async list(opts = {}) { throw new Error('not implemented'); }

  /** @param {string} prNo */
  async get(prNo) { throw new Error('not implemented'); }
}
