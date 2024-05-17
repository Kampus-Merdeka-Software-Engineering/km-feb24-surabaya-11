// Mengambil data dari file JSON
fetch('Data_Team_11.json')
  .then(response => response.json())
  .then(data => {
    // Menampilkan data pada console untuk memastikan data telah diambil dengan benar
    console.log(data);

    // Menampilkan data pada tabel
    var tbody = document.querySelector('#data-table tbody');
    data.forEach(item => {
      var row = document.createElement('tr');
      row.innerHTML = `
      <td>${item.BOROUGH}</td>
      <td>${item.NEIGHBORHOOD}</td>
      <td>${item.BUILDING_CLASS_CATEGORY}</td>
      <td>${item.TAX_CLASS_AT_PRESENT}</td>
      <td>${item.BLOCK}</td>
      <td>${item.LOT}</td>
      <td>${item.EASE_MENT}</td>
      <td>${item.BUILDING_CLASS_AT_PRESENT}</td>
      <td>${item.ADDRESS}</td>
      <td>${item.APARTMENT_NUMBER}</td>
      <td>${item.ZIP_CODE}</td>
      <td>${item.RESIDENTIAL_UNITS}</td>
      <td>${item.COMMERCIAL_UNITS}</td>
      <td>${item.TOTAL_UNITS}</td>
      <td>${item.LAND_SQUARE_FEET}</td>
      <td>${item.GROSS_SQUARE_FEET}</td>
      <td>${item.YEAR_BUILT}</td>
      <td>${item.TAX_CLASS}</td>
      <td>${item.BUILDING_CLASS_AT_TIME_OF_SALE}</td>
      <td>${item.SALE_PRICE}</td>
      <td>${item.SALE_DATE}</td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

