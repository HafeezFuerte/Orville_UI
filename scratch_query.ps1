$connectionString = "Server=89.116.28.159;Database=Eyewa;User Id=sa;Password=Fadel1@34$#;TrustServerCertificate=True;Encrypt=False;MultipleActiveResultSets=True;"
$connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
try {
    $connection.Open()
    $command = $connection.CreateCommand()
    $command.CommandText = @"
ALTER PROCEDURE [dbo].[GetOrderStatusList]
AS
BEGIN
    SET NOCOUNT ON;
    -- Fetches the 50 most recent sales with status from OrderTracking
    SELECT TOP 50
        s.SaleID AS SalesId,
        s.InvoiceNo,
        s.InvoiceDate, -- Included date column!
        s.CustomerName,
        s.CustomerNo,
        ISNULL(s.GrossTotal, 0) AS GrossTotal,
        ISNULL(s.Discount, 0) AS DiscountAmount,
        (ISNULL(s.GrossTotal, 0) - ISNULL(s.Discount, 0) - ISNULL(s.Balance, 0)) AS PaidAmount,
        ISNULL(s.Balance, 0) AS Balance,
        0 AS InsuranceAmount,
        ISNULL(t.StatusId, 0) AS OrderStatusId,
        os.StatusName,
        -- Aggregate product names using STUFF and XML PATH
        STUFF((SELECT ', ' + p.ProductName
               FROM SalesDetails sd
               LEFT JOIN Products p ON sd.ProductID = p.ProductID
               WHERE sd.SalesID = s.SaleID
               FOR XML PATH('')), 1, 2, '') AS ProductName
    FROM Sale s
    LEFT JOIN OrderTracking t ON s.SaleID = t.OrderId
    LEFT JOIN OrderStatuses os ON t.StatusId = os.Id
    ORDER BY s.SaleID DESC;
END
"@
    $command.ExecuteNonQuery()
    Write-Output "Stored procedure GetOrderStatusList altered successfully!"
} catch {
    Write-Error $_.Exception.Message
} finally {
    $connection.Close()
}
