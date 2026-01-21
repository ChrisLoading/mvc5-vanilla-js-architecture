USE PRDemo;
GO

INSERT dbo.PRHeader(PrNo, PrDate, Requester, Dept, ApproveStatus, CreatedAt)
VALUES
(N'PR2025-0001', N'2025/10/01', N'王小明', N'資訊部', N'未覆核',   N'2025-10-01T09:10:00+08:00'),
(N'PR2025-0002', N'2025/10/02', N'陳小華', N'總務部', N'審核中',   N'2025-10-02T10:20:00+08:00'),
(N'PR2025-0003', N'2025/10/03', N'林大同', N'財務部', N'簽核完成', N'2025-10-03T11:30:00+08:00');

DECLARE @id1 INT = (SELECT Id FROM dbo.PRHeader WHERE PrNo=N'PR2025-0001');
DECLARE @id2 INT = (SELECT Id FROM dbo.PRHeader WHERE PrNo=N'PR2025-0002');
DECLARE @id3 INT = (SELECT Id FROM dbo.PRHeader WHERE PrNo=N'PR2025-0003');

-- Approvers
INSERT dbo.PRApprover(PrId,Step,Title,Approver,ApproveDate,ApproveStatus) VALUES
(@id2,1,N'主管',N'李主管',N'2025/10/02',N'簽核完成'),
(@id2,2,N'經理',N'張經理',NULL,N'未覆核'),
(@id3,1,N'主管',N'李主管',N'2025/10/03',N'簽核完成'),
(@id3,2,N'經理',N'張經理',N'2025/10/03',N'簽核完成');

-- Items
INSERT dbo.PRItem(PrId,Idx,Category,Name,Spec,Qty,Vendor) VALUES
(@id1,1,N'軟體',N'VS License',N'Pro',5,N'AAA'),
(@id1,2,N'硬體',N'SSD',N'1TB',10,N'BBB'),
(@id2,1,N'辦公',N'紙張A4',N'80g',50,N'CCC'),
(@id3,1,N'服務',N'雲主機',N'2C4G',1,N'DDD');
