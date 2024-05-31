// Mengambil data dari file JSON
fetch("Data_Team_11.json")
  .then((response) => response.json())
  .then((data) => {

      // Tambahkan kode ini untuk membuat pie chart
      const categories = {};
            
      data.forEach(item => {
          const category = item['BUILDING_CLASS_CATEGORY']; // Adjust the key based on your JSON structure
          if (categories[category]) {
              categories[category]++;
          } else {
              categories[category] = 1;
          }
      });
      
      const labels = Object.keys(categories);
      const values = Object.values(categories);
      
      const ctx = document.getElementById('myPieChart').getContext('2d');
      const myPieChart = new Chart(ctx, {
          type: 'pie',
          data: {
              labels: labels,
              datasets: [{
                  data: values,
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
              responsive: true,
              plugins: {
                  legend: {
                      position: 'left',
                  },
                  tooltip: {
                      enabled: true
                  }
              }
          }
      });

      
  fetch('Data_Team_11.json')
    .then(response => response.json())
    .then(data => {
        // Process data
        const salesData = processData(data);

        // Extract regions and total selling prices
        const regions = Object.keys(salesData);
        const totalPrices = Object.values(salesData);

        // Create bar chart
        const ctx = document.getElementById('totalSalesChart').getContext('2d');
        const totalSalesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: regions,
                datasets: [{
                    label: 'Total Selling Price',
                    data: totalPrices,
                    backgroundColor: 'rgba( 47, 79, 79, 1 )',
                    borderColor: 'rgba( 0, 0, 0, 1 )',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value, index, values) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Total Selling Price: $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error fetching JSON:', error));

// Function to process JSON data and calculate total selling price by region
function processData(data) {
    const salesData = {};

    // Loop through each data entry
    data.forEach(entry => {
        const region = entry.NEIGHBORHOOD;
        const salePrice = parseInt(entry.SALE_PRICE);

        // Add sale price to the corresponding region
        if (salesData[region]) {
            salesData[region] += salePrice;
        } else {
            salesData[region] = salePrice;
        }
    });

    return salesData;
}


    // Menampilkan data pada console untuk memastikan data telah diambil dengan benar
    var array = [];
    var array_length = 0;
    var table_size = 100;
    var start_index = 1;
    var end_index = 0;
    var current_index = 1;
    var max_index = 0;

    function reload() {
      location.reload();
    }
    // Tambahan
    function preLoadCalculation() {
      array = data;
      array_length = array.length;
      max_index = array_length / table_size;

      if (array_length % table_size > 0) {
        max_index++;
      }
    }

    function sorting() {
      const sortKey = document.getElementById("sort-key").value;
      switch (sortKey) {
        case "borough":
          data.sort((a, b) => a.BOROUGH - b.BOROUGH);

          break;
        case "sale price":
          data.sort((a, b) => a.SALE_PRICE - b.SALE_PRICE);

          break;
        case "sale date":
          data.sort((a, b) => new Date(a.SALE_DATE) - new Date(b.SALE_DATE));
          break;
        default:
          alert("Anda Harus Memilih Kategori")
          location.reload();
          break;
      }
      displayTable();
    }
    let filteredData = []; // Deklarasi global untuk data yang sudah difilter
    let currentPage = 1; // Deklarasi global untuk halaman saat ini
    const pageSize = 100; // Jumlah item per halaman, sesuaikan dengan kebutuhan Anda

    function filter() {
      const filterKey = document.getElementById("filter-key").value;
      const filterValue = document.getElementById("filter-value").value;
      const filterMonth = filterValue.padStart(2, "0");

      switch (filterKey) {
        case "borough":
          filteredData = data.filter(
            (item) =>
              item.BOROUGH.toString().toLowerCase() ===
              filterValue.toLowerCase()
          );
          break;
        case "building class category":
          filteredData = data.filter((item) =>
            item.BUILDING_CLASS_CATEGORY.toLowerCase().includes(
              filterValue.toLowerCase()
            )
          );
          break;
        case "sale month":
          filteredData = data.filter((item) => {
            const saleDate = new Date(item.SALE_DATE);
            const saleMonth = (saleDate.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            return saleMonth === filterMonth;
          });
          break;
        default:
          alert("Anda Harus memilih kategori");
          location.reload();
          return;
      }

      if (filterValue === "") {
        alert("Anda harus memasukkan kata kunci");
        location.reload();
        return;
      } else if (filterKey === "sale month" && isNaN(Number(filterValue))) {
        alert("Kata Kunci yang dimasukkan Harus Angka");
        location.reload();
        return;
      }

      currentPage = 1; // Reset ke halaman pertama saat filter diterapkan
      updateTable(filteredData);
      updatePaginationButtons(filteredData.length);
    }

    function updateTable(data) {
      const table = document.getElementById("data-table");
      const oldTbody = table.querySelector("tbody");
      if (oldTbody) {
        table.removeChild(oldTbody);
      }

      const newTbody = document.createElement("tbody");

      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, data.length);

      data.slice(startIndex, endIndex).forEach((item) => {
        const row = document.createElement("tr");
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
        newTbody.appendChild(row);
      });

      table.appendChild(newTbody);
    }

    function updatePaginationButtons(totalItems) {
      const indexButtonsContainer = document.querySelector(".index_button");

      while (indexButtonsContainer.firstChild) {
        indexButtonsContainer.removeChild(indexButtonsContainer.firstChild);
      }

      const totalPages = Math.ceil(totalItems / pageSize);

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

      const indexButtons = document.querySelectorAll(".index_button button");
      indexButtons.forEach(function (button) {
        button.classList.remove("active");
      });

      const activeButton = document.querySelector(
        `.index_button button[data-index="${currentPage}"]`
      );
      if (activeButton) {
        activeButton.classList.add("active");
      }
    }

    // ini juga
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
    function highlightIndex() {
      start_index = (current_index - 1) * table_size + 1;
      end_index = start_index + table_size - 1;
      if (end_index > array_length) {
        end_index = array_length;
      }

      document
        .getElementById("go-to-page-button")
        .addEventListener("click", function () {
          const pageNumber = parseInt(
            document.getElementById("page-number").value
          );
          if (pageNumber >= 1 && pageNumber <= max_index) {
            current_index = pageNumber;
            highlightIndex();
          } else {
            alert(
              "Invalid page number. Please enter a number between 1 and 51."
            );
          }
        });

      // Memindahkan displayIndexButtons() ke bagian bawah fetch karena elemen .index_button belum ada saat function ini dipanggil
      // fetch('Data_Team_11.json')
      //    .then(response => response.json())
      //    .then(data => {
      //      // ... your existing code here ...

      //     // Panggil displayIndexButtons() di sini untuk memastikan elemen .index_button sudah ada
      //     displayIndexButtons();

      //  })
      // .catch(error => {
      //  console.error('Error fetching data:', error);
      // });

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

      data.slice(tab_start, tab_end + 1).forEach((datas) => {
        var row = document.createElement("tr");
        row.innerHTML = `
      <td>${datas["NEIGHBORHOOD"]}</td>
      <td>${datas["BUILDING_CLASS_CATEGORY"]}</td>
      <td>${datas["ADDRESS"]}</td>
      <td>${datas["TOTAL_UNITS"]}</td>
      <td>${datas["LAND_SQUARE_FEET"]}</td>
      <td>${datas["GROSS_SQUARE_FEET"]}</td>
      <td>${datas["YEAR_BUILT"]}</td>
      <td>${datas["SALE_PRICE"]}</td>
      <td>${datas["SALE_DATE"]}</td>
    `;
        newTbody.appendChild(row);
      });

      // Menambahkan tbody baru ke tabel
      table.appendChild(newTbody);
    }

    function nextIndex() {
      if (current_index < max_index) {
        current_index++;
        highlightIndex();
      }
    }
    function prevIndex() {
      if (current_index > 1) {
        current_index--;
        highlightIndex();
      }
    }
    function indexPagination(index) {
      current_index = parseInt(index);
      highlightIndex();
    }

    displayIndexButtons();

    document.getElementById("sort-button").addEventListener("click", sorting);
    document.getElementById("filter-button").addEventListener("click", filter);
    document.getElementById("reset").addEventListener("click", reload);
    // Inisialisasi tampilan awal (opsional, bisa dipanggil saat halaman dimuat)
    preLoadCalculation();
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
