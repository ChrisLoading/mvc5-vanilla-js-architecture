alter table dbo.Inventory
add RowVersion rowversion;

alter table ProcureInv.dbo.Inventory
add 
	SkuDate date not null constraint DF_Inventory_SkuDate default (cast(sysdatetime() as date)),
	SkuSerial int not null constraint DF_Inventory_SkuSerial default (0);

alter table ProcureInv.dbo.Inventory
	add constraint CK_Inventory_SkuSerial_Positive check (SkuSerial >= 1);

alter table ProcureInv.dbo.Inventory
	add Sku as (
		convert(char(8), SkuDate, 112) + 
		'-' + 
		right(replicate('0',4) + convert(varchar(10), SkuSerial), 4)
		) persisted;
