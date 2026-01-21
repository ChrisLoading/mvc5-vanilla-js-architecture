/**
* @typedef {Object} Approver
* @property {string} title
* @property {string} approver
* @property {string} approveDate
* @property {string} approveStatus
*
* @typedef {Object} PRItem
* @property {number|string} idx
* @property {string} category
* @property {string} name
* @property {string} spec
* @property {number|string} qty
* @property {string} vendor
*
* @typedef {Object} PR
* @property {string} prNo
* @property {string} prDate
* @property {string} requester
* @property {string} dept
* @property {string} [approveStatus]
* @property {string} [status]
* @property {string} createdAt
* @property {Approver[]} [approvers]
* @property {PRItem[]} [items]
*/


export {}; // 只有型別註記，避免空模組錯誤