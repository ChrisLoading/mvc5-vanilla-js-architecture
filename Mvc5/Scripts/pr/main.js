// 進入點：只做三件事：1) 建 repo, 2) 掛側欄, 3) 啟動頁面邏輯
import { HttpPRRepo } from './repo/HttpPRRepo.js';
import { LocalPRRepo } from './repo/LocalPRRepo.js';
import { WirePage } from './ui/events.js';

// 切換資料來源（POC→API 一鍵換）
 const USE_API = true;
//const USE_API = false;
const API_BASE = '/api';
const repo = USE_API ? new HttpPRRepo(API_BASE) : new LocalPRRepo();

/* 側欄載入（有 sidebar.html 則載入，否則備援） */
//async function mountSidebar() {
//    const el = document.querySelector('[data-include]');
//    if (!el) return;
//    try { 
//        const res = await fetch(el.getAttribute('data-include'), {cache: 'no-store'});
//        if (!res.ok) throw new Error(`HTTP ${res.status}`);
//        el.innerHTML = await res.text();
//        (el.querySelector('[data-key="pr"]')||el.querySelector('a[href*="pr_history.html"]'))?.classList.add('is-active');
//    } catch {
//        el.innerHTML =
//          '<div class="nav-title">功能選單</div>'+
//          '<ul class="nav-list">'+
//            '<li><a data-key="pr" href="pr_history.html" class="is-active">請購單</a></li>'+
//            '<li><a data-key="po" href="po_history.html">採購單</a></li>'+
//            '<li><a data-key="gr" href="gr_history.html">驗收單</a></li>'+
//            '<li><a data-key="in" href="in_history.html">入庫單</a></li>'+
//            '<li><a data-key="itr" href="ITR_history.html">調撥單</a></li>'+
//            '<li><a data-key="st" href="store.html">庫存表</a></li>'+
//          '</ul>';
//    }

//    document.addEventListener('click', (e) => {
//        const a = e.target.closest('a[target="_blank"]');
//        if (a && a.href) {
//            e.preventDefault();
//            location.assign(a.href);
//        }
//    });

//    (function() {
//        const oldOpen = window.open;
//        window.open = function(url) {
//            if (typeof url ==='string') {
//                location.assign(url);
//                return null;
//            }
//            return oldOpen.apply(window, arguments);
//        }
//    })();
//}

addEventListener('DOMContentLoaded', async () => {
    //await mountSidebar().catch(console.error);
    await WirePage({ repo });
});