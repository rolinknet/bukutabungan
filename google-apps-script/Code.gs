
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.openById("YOUR_SHEET_ID");

  if (data.action === "tambahTransaksi") {
    const sheetTrans = ss.getSheetByName("Transaksi");
    const sheetNasabah = ss.getSheetByName("Nasabah");

    const tanggal = Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd");
    sheetTrans.appendRow([data.nama, tanggal, data.jenis, data.jumlah]);

    const rows = sheetNasabah.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === data.nama) {
        let saldo = rows[i][2];
        let pinjaman = rows[i][3];

        switch (data.jenis) {
          case "Setor":
            saldo += data.jumlah;
            break;
          case "Tarik":
            saldo -= data.jumlah;
            break;
          case "Pinjam":
            pinjaman += data.jumlah;
            break;
          case "Bayar Pinjaman":
            pinjaman -= data.jumlah;
            break;
        }

        sheetNasabah.getRange(i + 1, 3).setValue(saldo);
        sheetNasabah.getRange(i + 1, 4).setValue(pinjaman);
        break;
      }
    }
    return ContentService.createTextOutput("Transaksi ditambahkan");
  }

  return ContentService.createTextOutput("No action matched.");
}
