//Piechart dengan data langsung dimasukkan
document.addEventListener('DOMContentLoaded', (event) => {
  const boroughCounts = {
      'Manhattan': 18102,
      'Bronx': 6994,
      'Brooklyn': 23843,
      'Queens': 26548,
      'Staten Island': 8296
  };

  // Mengambil kunci dan nilai dari boroughCounts dan menyimpannya ke dalam array labels dan values
  const labels = Object.keys(boroughCounts); // ['Manhattan', 'Bronx', 'Brooklyn', 'Queens', 'Staten Island']
  const values = Object.values(boroughCounts); // [18102, 6994, 23843, 26548, 8296]

  // Mendapatkan konteks dari elemen canvas dengan id 'myPieChart'
  const ctx = document.getElementById('myPieChart').getContext('2d');

  // Membuat chart baru dengan tipe pie (pie chart)
  const myPieChart = new Chart(ctx, {
    type: 'pie', // Jenis chart adalah pie
    data: {
      labels: labels, // Label untuk setiap bagian pada pie chart
      datasets: [{
        data: values, // Data nilai untuk setiap bagian pada pie chart
        backgroundColor: [ // Warna latar belakang untuk setiap bagian
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [ // Warna border untuk setiap bagian
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1 // Ketebalan border untuk setiap bagian
      }]
    },
    options: {
      responsive: true, // Chart akan menyesuaikan ukuran dengan elemen parent
      plugins: {
        legend: {
          position: 'left', // Posisi legenda berada di sebelah kiri
        },
        tooltip: {
          enabled: true // Aktifkan tooltip
        }
      }
    }
  });
});


// Fungsi untuk format kunci bulan-tahun
function getMonthYear(dateStr) {
  // Mengonversi string tanggal menjadi objek Date
  const date = new Date(dateStr);
  // Opsi format bulan-tahun
  const options = { year: 'numeric', month: 'short' };
  // Mengembalikan tanggal yang diformat menjadi string bulan-tahun
  return date.toLocaleDateString('en-US', options);
}

// Membaca data dari file JSON
fetch('Data_Team_11.json')
  .then(response => response.json())
  .then(data => {
    // Inisialisasi objek untuk menyimpan data penjualan per bulan
    const unitsSoldByMonth = {};
    const salePriceByMonth = {};

    // Mengonversi tanggal penjualan menjadi format bulan-tahun dan menghitung total penjualan per bulan
    data.forEach(sale => {
      const saleDate = getMonthYear(sale.SALE_DATE);
      if (!unitsSoldByMonth[saleDate]) {
        // Inisialisasi nilai awal jika belum ada data untuk bulan tersebut
        unitsSoldByMonth[saleDate] = 0;
        salePriceByMonth[saleDate] = 0;
      }
      // Menambahkan jumlah unit terjual dan harga penjualan pada bulan yang bersangkutan
      unitsSoldByMonth[saleDate] += parseFloat(sale.TOTAL_UNITS);
      salePriceByMonth[saleDate] += parseFloat(sale.SALE_PRICE);
    });

    // Memastikan semua bulan dari September 2016 hingga Agustus 2017 direpresentasikan dalam data
    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(2016, 8 + i); // Dimulai dari September 2016 (bulan ke-8)
      const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      months.push(monthYear);
      if (!unitsSoldByMonth[monthYear]) {
        // Inisialisasi nilai awal jika belum ada data untuk bulan tersebut
        unitsSoldByMonth[monthYear] = 0;
        salePriceByMonth[monthYear] = 0;
      }
    }

   // Ekstrak label bulan dan nilai penjualan
    const unitsSold = months.map(month => unitsSoldByMonth[month]);
    const salePrices = months.map(month => salePriceByMonth[month]);

    // Gambar diagram garis untuk total unit yang terjual menggunakan Chart.js
    const unitsSoldCtx = document.getElementById('unitsSoldChart').getContext('2d');
    const unitsSoldChart = new Chart(unitsSoldCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Total Units Sold',
                data: unitsSold,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Gambar diagram garis untuk total harga jual menggunakan Chart.js
    const salePriceCtx = document.getElementById('salePriceChart').getContext('2d');
    const salePriceChart = new Chart(salePriceCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Total Sale Price',
                data: salePrices,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

//Chart 4 
  // Mengambil data dari file JSON
fetch('Data_Team_11.json')
.then((response) => response.json())
.then((data) => {


  // Proses data untuk bar chart
  const salesData = processData(data);

  // Extract regions and total units
  const regions = Object.keys(salesData);
  const totalUnits = Object.values(salesData);

  // Generate an array of colors for the bars
  const colors = regions.map((_, index) => `hsl(${index * 30 % 360}, 70%, 50%)`);

  // Membuat Chart
  const ctxBar = document.getElementById('totalSalesChart').getContext('2d');
  const totalSalesChart = new Chart(ctxBar, {
      type: 'bar',
      data: {
          labels: regions,
          datasets: [{
              label: 'Total Units',
              data: totalUnits,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
            x: {
                ticks: {
                    font: {
                        size: 8 // Ukuran font yang lebih kecil
                    }
                }
            },
              y: {
                beginAtZero: true, // Mulai sumbu Y dari nilai 0
                ticks: { // Pengaturan untuk label sumbu Y
                    callback: function(value, index, values) { // Fungsi untuk mengubah format nilai label
                        return value.toLocaleString(); // Menggunakan metode toLocaleString() untuk format ribuan
                    }
                  }
              }
          },
          plugins: { // Pengaturan untuk plugin tooltip
            tooltip: {
                callbacks: {
                    label: function(context) { // Fungsi untuk menentukan label tooltip
                        return 'Total Unit: ' + context.parsed.y.toLocaleString(); // Menggunakan metode toLocaleString() untuk format ribuan pada nilai Y
                    }
                  }
              }
          }
      }
  });
})
.catch(error => console.error('Error fetching JSON:', error));

// Function to process JSON data and calculate total units by region
function processData(data) {
const unitsData = {};

// Loop through each data entry
data.forEach(entry => {
    const region = entry.NEIGHBORHOOD;
    const units = parseInt(entry.TOTAL_UNITS); // Adjust the key based on your JSON structure

    // Add units to the corresponding region
    if (unitsData[region]) {
        unitsData[region] += units;
    } else {
        unitsData[region] = units;
    }
});

return unitsData;
}

//chart 5
// Menunggu hingga seluruh dokumen HTML dimuat
document.addEventListener('DOMContentLoaded', function() {
  // Mendapatkan elemen neighborhoodSelector dari dokumen
  const neighborhoodSelector = document.getElementById('neighborhoodSelector');
  // Menambahkan event listener untuk perubahan pada elemen neighborhoodSelector
  neighborhoodSelector.addEventListener('change', fetchDataAndDisplay);
  // Memanggil fungsi fetchDataAndDisplay saat halaman pertama kali dimuat untuk menampilkan grafik
  fetchDataAndDisplay();
});


let myChart;

// Fungsi untuk mengambil data dan menampilkannya
function fetchDataAndDisplay() {
  // Mendapatkan nilai dari elemen select dengan id 'neighborhoodSelector'
  const selectedNeighborhood = document.getElementById('neighborhoodSelector').value;

  // Melakukan fetch data dari file JSON
  fetch('Data_Team_11.json')
    .then(response => {
      // Memeriksa apakah respon dari jaringan oke (status 200)
      if (!response.ok) {
        // Melempar error jika respon tidak oke
        throw new Error('Network response was not ok ' + response.statusText);
      }
      // Mengembalikan data dalam format JSON
      return response.json();
    })
    .then(data => {
      let filteredData;
      // Memeriksa apakah neighborhood yang dipilih adalah 'ALL NEIGHBORHOOD'
      if (selectedNeighborhood === 'ALL NEIGHBORHOOD') {
        // Mengambil semua data tanpa filter
        filteredData = data;
      } else {
        // Filter data berdasarkan neighborhood yang dipilih
        filteredData = data.filter(item => item.NEIGHBORHOOD === selectedNeighborhood);
      }
      // Menampilkan data yang telah difilter di konsol
      console.log('Filtered Data:', filteredData);

      // Membuat objek untuk menyimpan kategori kelas bangunan
      const buildingClassCategories = {};
      // Loop melalui data yang telah difilter
      filteredData.forEach(item => {
        const buildingClassCategory = item.BUILDING_CLASS_CATEGORY;
        // Jika kategori kelas bangunan sudah ada di objek, tambahkan total unitnya
        if (buildingClassCategories[buildingClassCategory]) {
          buildingClassCategories[buildingClassCategory] += parseInt(item.TOTAL_UNITS);
        } else {
          // Jika belum ada, tambahkan kategori kelas bangunan ke objek dengan total unitnya
          buildingClassCategories[buildingClassCategory] = parseInt(item.TOTAL_UNITS);
        }
      });

          // Mendapatkan array label dari kategori kelas bangunan
          const labels = Object.keys(buildingClassCategories);
          // Mendapatkan array nilai data dari kategori kelas bangunan
          const dataValues = Object.values(buildingClassCategories);

          // Hapus grafik sebelumnya jika sudah ada
          if (myChart) {
              myChart.destroy();
          }

          displayPieChart(labels, dataValues);
      })
      .catch(error => console.error('Error fetching the data:', error));
}
// Fungsi untuk menampilkan diagram lingkaran (pie chart)
function displayPieChart(labels, dataValues) {
  // Dapatkan konteks grafik dari elemen canvas dengan ID 'buildingChart'
  const ctx = document.getElementById('buildingChart').getContext('2d');
  
  // Buat objek Chart baru dengan tipe 'pie' (diagram lingkaran)
  myChart = new Chart(ctx, {
      type: 'pie',
      data: {
          // Gunakan nilai label yang diberikan sebagai label untuk setiap potongan diagram lingkaran
          labels: labels,
          datasets: [{
              // Gunakan nilai data yang diberikan sebagai nilai untuk setiap potongan diagram lingkaran
              data: dataValues,
              // Tetapkan warna latar belakang untuk setiap potongan diagram lingkaran
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              // Tetapkan warna batas untuk setiap potongan diagram lingkaran
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              // Tentukan lebar batas untuk setiap potongan diagram lingkaran
              borderWidth: 1
          }]
      },
      options: {
          // Matikan tampilan legenda diagram lingkaran
          plugins: {
              legend: {
                  display: false
              },
              // Aktifkan tampilan tooltip saat mengarahkan kursor di atas potongan diagram lingkaran
              tooltip: {
                  enabled: true
              }
          }
      }
  });
}

    // Menampilkan data pada console untuk memastikan data telah diambil dengan benar
    fetch('Data_Team_11.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
    var array = [];
    var array_length = 0;
    var table_size = 100;
    var start_index = 1;
    var end_index = 0;
    var current_index = 1;
    var max_index = 0;

    // Fungsi untuk me-refresh ulang halaman
  function reload() {
  location.reload(); // Memuat ulang halaman
  }

// Fungsi untuk menghitung prakondisi saat halaman dimuat
  function preLoadCalculation() {
  // Menetapkan nilai array dan panjang array
  array = data;
  array_length = array.length;
  // Menghitung maksimum indeks halaman berdasarkan ukuran tabel
  max_index = array_length / table_size;

  // Jika terdapat sisa data, tambahkan satu halaman ekstra
    if (array_length % table_size > 0) {
      max_index++;
    }
  }


    // Fungsi untuk mengurutkan data berdasarkan kunci yang dipilih
    function sorting() {
      // Mendapatkan nilai kunci sorting dari input dengan id "sort-key"
      const sortKey = document.getElementById("sort-key").value;
      
      // Switch case untuk menentukan kriteria sorting berdasarkan kunci sorting
      switch (sortKey) {
        case "borough":
          // Mengurutkan data berdasarkan nilai borough (secara numerik)
          data.sort((a, b) => a.BOROUGH - b.BOROUGH);
          break;
        case "sale price":
          // Mengurutkan data berdasarkan harga penjualan (secara numerik)
          data.sort((a, b) => a.SALE_PRICE - b.SALE_PRICE);
          break;
        case "sale date":
          // Mengurutkan data berdasarkan tanggal penjualan (secara kronologis)
          data.sort((a, b) => new Date(a.SALE_DATE) - new Date(b.SALE_DATE));
          break;
        default:
          // Tampilkan alert jika kategori sorting tidak dipilih
          alert("Anda Harus Memilih Kategori");
          location.reload();
          break;
      }
    }
    
      displayTable();
    let filteredData = []; // Deklarasi global untuk data yang sudah difilter
    let currentPage = 1; // Deklarasi global untuk halaman saat ini
    const pageSize = 100; // Jumlah item per halaman, sesuaikan dengan kebutuhan Anda

    // Fungsi untuk melakukan filter data
    function filter() {
      // Mendapatkan nilai kunci filter dari elemen dengan id "filter-key"
      const filterKey = document.getElementById("filter-key").value;
      
      // Mendapatkan nilai filter dari elemen dengan id "filter-value"
      const filterValue = document.getElementById("filter-value").value;
      
      // Mengonversi nilai filter menjadi format dua digit jika perlu
      const filterMonth = filterValue.padStart(2, "0");

      switch (filterKey) {
        case "borough":
          // Filter data berdasarkan nilai borough
          filteredData = data.filter(
            (item) =>
              item.BOROUGH.toString().toLowerCase() ===
              filterValue.toLowerCase()
          );
          break;
        case "building class category":
          // Filter data berdasarkan nilai kategori kelas bangunan
          filteredData = data.filter((item) =>
            item.BUILDING_CLASS_CATEGORY.toLowerCase().includes(
              filterValue.toLowerCase()
            )
          );
          break;
        case "sale month":
          // Filter data berdasarkan bulan penjualan
          filteredData = data.filter((item) => {
            const saleDate = new Date(item.SALE_DATE); // Mengonversi tanggal penjualan ke objek Date
            const saleMonth = (saleDate.getMonth() + 1) // Mengambil bulan penjualan (bulan dimulai dari 0)
              .toString()
              .padStart(2, "0"); // Menambahkan padding "0" di depan jika kurang dari 2 digit
            return saleMonth === filterMonth; // Membandingkan bulan penjualan dengan nilai filter bulan
          });
          break;
        default:
          // Tampilkan alert jika kategori filter tidak dipilih
          alert("Anda Harus memilih kategori");
          location.reload(); // Memuat ulang halaman
          return;
      }      

            // Memeriksa apakah nilai filter kosong
      if (filterValue === "") {
        // Menampilkan alert jika nilai filter kosong
        alert("Anda harus memasukkan kata kunci");
        // Memuat ulang halaman
        location.reload();
        return;
      } else if (filterKey === "sale month" && isNaN(Number(filterValue))) {
        // Memeriksa apakah kunci filter adalah "sale month" dan nilai filter bukan angka
        // Menampilkan alert jika nilai filter bukan angka
        alert("Kata Kunci yang dimasukkan Harus Angka");
        // Memuat ulang halaman
        location.reload();
        return;
      }

      currentPage = 1; // Reset ke halaman pertama saat filter diterapkan
      updateTable(filteredData);
      updatePaginationButtons(filteredData.length);
    }

    // Fungsi untuk memperbarui tabel dengan data yang diberikan
    function updateTable(data) {
      // Mendapatkan elemen tabel berdasarkan ID
      const table = document.getElementById("data-table");
    
      // Menemukan elemen tbody lama
      const oldTbody = table.querySelector("tbody");
      
      // Jika tbody lama ada, hapus dari tabel
      if (oldTbody) {
        table.removeChild(oldTbody);
      }
    
      // Membuat elemen tbody baru
      const newTbody = document.createElement("tbody");
    
      // Menghitung indeks mulai dan berakhir untuk data halaman saat ini
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, data.length);
    
      // Loop melalui data halaman saat ini dan membuat baris tabel
      data.slice(startIndex, endIndex).forEach((item) => {
        const row = document.createElement("tr");
        // Mengatur inner HTML dari baris dengan data
        row.innerHTML = `
          <td>${item["NEIGHBORHOOD"]}</td>
          <td>${item["BUILDING_CLASS_CATEGORY"]}</td>
          <td>${item["ADDRESS"]}</td>
          <td>${item["TOTAL_UNITS"]}</td>
          <td>${item["LAND_SQUARE_FEET"]}</td>
          <td>${item["GROSS_SQUARE_FEET"]}</td>
          <td>${item["YEAR_BUILT"]}</td>
          <td>${item["SALE_PRICE"]}</td>
          <td>${item["SALE_DATE"]}</td>
        `;
        // Menambahkan baris ke tbody baru
        newTbody.appendChild(row);
      });
    
      // Menambahkan tbody baru ke tabel
      table.appendChild(newTbody);
    }
    
    // Fungsi untuk memperbarui tombol-tombol navigasi halaman (pagination) berdasarkan total item
    function updatePaginationButtons(totalItems) {
      // Mendapatkan container untuk tombol paginasi
      const indexButtonsContainer = document.querySelector(".index_button");
    
      // Menghapus tombol yang ada dari container
      while (indexButtonsContainer.firstChild) {
        indexButtonsContainer.removeChild(indexButtonsContainer.firstChild);
      }
    
      // Menghitung total halaman
      const totalPages = Math.ceil(totalItems / pageSize);
    
      // Membuat tombol 'Prev'
      const prevButton = document.createElement("button");
      prevButton.textContent = "Prev";
      prevButton.disabled = currentPage === 1;
      prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          updateTable(filteredData);
          updatePaginationButtons(filteredData.length);
        }
      });
      indexButtonsContainer.appendChild(prevButton);
    
      // Membuat tombol nomor halaman
      for (let i = 1; i <= totalPages; i++) {
        const indexButton = document.createElement("button");
        indexButton.textContent = i;
        indexButton.disabled = currentPage === i;
        indexButton.addEventListener("click", () => {
          currentPage = i;
          updateTable(filteredData);
          updatePaginationButtons(filteredData.length);
        });
        indexButtonsContainer.appendChild(indexButton);
      }
    
      // Membuat tombol 'Next'
      const nextButton = document.createElement("button");
      nextButton.textContent = "Next";
      nextButton.disabled = currentPage === totalPages;
      nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
          currentPage++;
          updateTable(filteredData);
          updatePaginationButtons(filteredData.length);
        }
      });
      indexButtonsContainer.appendChild(nextButton);
    
      // Mendapatkan semua tombol paginasi dan menghapus kelas 'active'
      const indexButtons = document.querySelectorAll(".index_button button");
      indexButtons.forEach(function (button) {
        button.classList.remove("active");
      });
    
      // Menemukan tombol yang sesuai dengan halaman saat ini dan menambahkan kelas 'active'
      const activeButton = document.querySelector(
        `.index_button button[data-index="${currentPage}"]`
      );
      if (activeButton) {
        activeButton.classList.add("active");
      }
    }
    
    // Fungsi untuk menampilkan tombol-tombol indeks halaman
    function displayIndexButtons() {
      preLoadCalculation(); // Pastikan fungsi ini didefinisikan jika diperlukan
      var indexButtonsContainer = document.querySelector(".index_button");

      // Menghapus semua elemen di dalam .index_buttons
      while (indexButtonsContainer.firstChild) {
        indexButtonsContainer.removeChild(indexButtonsContainer.firstChild);
      }

      // Menambahkan tombol "Prev"
      var prevButton = document.createElement("button");
      prevButton.textContent = "Prev";
      indexButtonsContainer.appendChild(prevButton);
      prevButton.addEventListener("click", function () {
        // Logika yang ingin dijalankan saat tombol "Prev" diklik
        console.log("Prev");
        prevIndex();
        // Tambahkan logika Anda di sini
      });

      // Menambahkan tombol-tombol indeks
      for (var i = 1; i <= max_index; i++) {
        var indexButton = document.createElement("button");
        indexButton.textContent = i;
        indexButton.setAttribute("data-index", i);
        indexButton.addEventListener("click", function () {
          current_index = this.getAttribute("data-index"); // Mengambil nilai indeks dari atribut data-index
          indexPagination(current_index);
          // Lakukan sesuatu dengan nilai indeks, misalnya memanggil fungsi untuk menampilkan data pada indeks tersebut
        });
        indexButtonsContainer.appendChild(indexButton);
      }

      // Menambahkan tombol "Next"
      var nextButton = document.createElement("button");
      nextButton.textContent = "Next";
      indexButtonsContainer.appendChild(nextButton);
      nextButton.addEventListener("click", function () {
        // Logika yang ingin dijalankan saat tombol "Prev" diklik
        nextIndex();
        // Tambahkan logika Anda di sini
      });
      highlightIndex();
    }
    
    // Fungsi untuk menyorot indeks halaman
    function highlightIndex() {
      // Menghitung indeks awal dan akhir yang akan disorot
      start_index = (current_index - 1) * table_size + 1;
      end_index = start_index + table_size - 1;
      // Memastikan end_index tidak melebihi panjang array
      if (end_index > array_length) {
        end_index = array_length;
      }
      // Menambahkan event listener pada tombol "go-to-page"
      document
        .getElementById("go-to-page-button")
        .addEventListener("click", function () {
          const pageNumber = parseInt(
            document.getElementById("page-number").value
          );

        // Memeriksa apakah nomor halaman valid (antara 1 dan 51)
      if (pageNumber >= 1 && pageNumber <= max_index) {
        // Menyimpan nomor halaman saat ini
        current_index = pageNumber;
        
        // Memanggil fungsi highlightIndex() untuk memperbarui tampilan
        highlightIndex();
      } else {
        // Menampilkan peringatan jika nomor halaman tidak valid
        alert(
          "Nomor halaman tidak valid. Silakan masukkan nomor antara 1 dan 51."
        );
      }
    });

      // Mengupdate teks dalam elemen span dengan kelas pagination_button
      var paginationSpan = document.querySelector(".pagination_button span");
      paginationSpan.textContent = `Showing ${start_index} to ${end_index} of ${array_length} entries`;

      // Menghapus kelas 'active' dari semua tombol dengan kelas index_button
      var indexButtons = document.querySelectorAll(".index_button button");
      indexButtons.forEach(function (button) {
        button.classList.remove("active");
      });

      // Menambahkan kelas 'active' pada tombol dengan atribut index yang sesuai
      var activeButton = document.querySelector(
        `.index_button button[index="${current_index}"]`
      );
      if (activeButton) {
        activeButton.classList.add("active");
      }
      displayTable();
    }

    // Fungsi untuk menampilkan tabel
    function displayTable() {
      // Menghapus elemen tbody yang ada di dalam tabel dengan id data-table
      var table = document.getElementById("data-table");
      var oldTbody = table.querySelector("tbody");
      if (oldTbody) {
        table.removeChild(oldTbody);
      }

      // Membuat elemen tbody baru
      var newTbody = document.createElement("tbody");

      // Menentukan indeks mulai dan akhir
      var tab_start = start_index - 1;
      var tab_end = end_index;

      // Melakukan iterasi pada data yang dipotong (sliced) untuk mengisi baris tabel
      data.slice(tab_start, tab_end + 1).forEach((datas) => {
      // Membuat elemen baris baru untuk tabel
      var row = document.createElement("tr");
      // Menambahkan isi dari setiap kolom pada baris tabel menggunakan data yang diberikan
      row.innerHTML = `
    <td>${datas["NEIGHBORHOOD"]}</td>
    <td>${datas["BUILDING_CLASS_CATEGORY"]}</td>
    <td>${datas["ADDRESS"]}</td>
    <td>${datas["TOTAL_UNITS"]}</td>
    <td>${datas["LAND_SQUARE_FEET"]}</td>
    <td>${datas["GROSS_SQUARE_FEET"]}</td>
    <td>${datas["YEAR_BUILT"]}</td>
    <td>${datas["SALE_PRICE"]}</td>
    <td>${datas["SALE_DATE"]}</td>`;
    // Menambahkan baris ke dalam tbody baru
    newTbody.appendChild(row);
    });
      // Menambahkan tbody baru ke tabel
      table.appendChild(newTbody);
    }

   // Fungsi untuk menavigasi ke indeks halaman berikutnya
  function nextIndex() {
    // Memeriksa apakah indeks saat ini kurang dari indeks maksimum
    if (current_index < max_index) {
    // Jika ya, maka inkrementasi indeks saat ini dan sorot indeks baru
    current_index++;
    highlightIndex();
    }
  }

  // Fungsi untuk menavigasi ke indeks halaman sebelumnya
  function prevIndex() {
    // Memeriksa apakah indeks saat ini lebih besar dari 1
    if (current_index > 1) {
    // Jika ya, maka dekrementasi indeks saat ini dan sorot indeks baru
    current_index--;
    highlightIndex();
    }
  }

  // Fungsi untuk menavigasi ke indeks halaman tertentu
  function indexPagination(index) {
  // Mengatur indeks saat ini ke nilai yang diberikan dan sorot indeks baru
  current_index = parseInt(index);
  highlightIndex();
  }

// Memanggil fungsi untuk menampilkan tombol-tombol indeks halaman
displayIndexButtons();

// Menambahkan event listener untuk tombol "sort"
document.getElementById("sort-button").addEventListener("click", sorting);

// Menambahkan event listener untuk tombol "filter"
document.getElementById("filter-button").addEventListener("click", filter);

// Menambahkan event listener untuk tombol "reset"
document.getElementById("reset").addEventListener("click", reload);

// Inisialisasi tampilan awal (opsional, bisa dipanggil saat halaman dimuat)
preLoadCalculation();
  })
  .catch(error => console.error('Error fetching the data:', error));

