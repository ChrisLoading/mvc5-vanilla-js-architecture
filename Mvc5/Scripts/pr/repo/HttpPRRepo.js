import { PRRepo } from "./PRRepo.js";

export class HttpPRRepo extends PRRepo { 
    constructor(base) {
        super();
        this.base = base.replace(/\/+$/,'');
    }

    async list({status, q, page=1, pageSize=50}={}) {
        const url = new URL(this.base + '/pr', location.origin);
        if (status) {
            url.searchParams.set('status', status);
        }
        if (q) { 
            url.searchParams.set('q', q);
        }
        url.searchParams.set('page', page);
        url.searchParams.set('pageSize', pageSize);

        const res = await fetch (
            url.toString(),
            { credentials: 'same-origin' }
        );
        if (!res.ok) {
            throw new Error('HTTP error ' + res.status);
        }
        return res.json(); // 期望 { items:[PR], total:number, page:number, pageSize:number }
    }

    async get(prNo) {
        const res = await fetch(
            `${this.base}/pr/${encodeURIComponent(prNo)}`,
            { credentials: 'same-origin' }
        );
        if (!res.ok) {
            throw new Error('HTTP error ' + res.status);
        }
        return res.json(); // 期望 PR
    }
}