-- 建庫
IF DB_ID('PRDemo') IS NULL
BEGIN
  CREATE DATABASE PRDemo;
END
GO
USE PRDemo;
GO

-- 主表：請購單頭
IF OBJECT_ID('dbo.PRHeader','U') IS NOT NULL DROP TABLE dbo.PRHeader;
CREATE TABLE dbo.PRHeader (
    Id            INT IDENTITY(1,1) PRIMARY KEY,
    PrNo          NVARCHAR(30) NOT NULL,         -- PR2025-0001
    PrDate        NVARCHAR(20) NULL,             -- 先用 NVARCHAR 對齊你舊資料，之後可換成 date
    Requester     NVARCHAR(50) NULL,
    Dept          NVARCHAR(50) NULL,
    ApproveStatus NVARCHAR(20) NULL,             -- 若改 tinyint 請同步控制器
    CreatedAt     NVARCHAR(30) NULL              -- 或 DATETIME2(0)，配合前端 ISO 顯示
);
CREATE UNIQUE INDEX UX_PRHeader_PrNo ON dbo.PRHeader(PrNo);

-- 覆核流：多筆對應一張 PR
IF OBJECT_ID('dbo.PRApprover','U') IS NOT NULL DROP TABLE dbo.PRApprover;
CREATE TABLE dbo.PRApprover (
    Id            INT IDENTITY(1,1) PRIMARY KEY,
    PrId          INT NOT NULL,
    Step          INT NOT NULL,                  -- 流程順序 1..n
    Title         NVARCHAR(50) NULL,
    Approver      NVARCHAR(50) NULL,
    ApproveDate   NVARCHAR(20) NULL,             -- 可改 DATETIME2
    ApproveStatus NVARCHAR(20) NULL,
    CONSTRAINT FK_PRApprover_PRHeader FOREIGN KEY (PrId) REFERENCES dbo.PRHeader(Id) ON DELETE CASCADE
);
CREATE INDEX IX_PRApprover_PrId_Step ON dbo.PRApprover(PrId, Step);

-- 明細表：多筆對應一張 PR
IF OBJECT_ID('dbo.PRItem','U') IS NOT NULL DROP TABLE dbo.PRItem;
CREATE TABLE dbo.PRItem (
    Id        INT IDENTITY(1,1) PRIMARY KEY,
    PrId      INT NOT NULL,
    Idx       INT NOT NULL,                      -- 項次
    Category  NVARCHAR(50) NULL,
    Name      NVARCHAR(100) NULL,
    Spec      NVARCHAR(200) NULL,
    Qty       INT NULL,
    Vendor    NVARCHAR(100) NULL,
    CONSTRAINT FK_PRItem_PRHeader FOREIGN KEY (PrId) REFERENCES dbo.PRHeader(Id) ON DELETE CASCADE
);
CREATE INDEX IX_PRItem_PrId_Idx ON dbo.PRItem(PrId, Idx);
GO
