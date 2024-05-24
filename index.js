// Mengambil data dari file JSON
fetch('Data_Team_11.json')
  .then(response => response.json())
  .then(data => {
    // Menampilkan data pada console untuk memastikan data telah diambil dengan benar
    var array = []
    var array_length = 0
    var table_size = 100
    var start_index = 1
    var end_index = 0
    var current_index = 1
    var max_index = 0


    // Tambahan
    function preLoadCalculation() {
      array = data
      array_length = array.length
      max_index = array_length / table_size

      if ((array_length % table_size) > 0) {
        max_index++
      }

    }

    function sorting() {
      const sortKey = document.getElementById('sort-key').value;
      switch (sortKey) {
        case 'borough':
          data.sort((a, b) => a.BOROUGH - b.BOROUGH);

          break;
        case 'sale price':
          data.sort((a, b) => a.SALE_PRICE - b.SALE_PRICE);

          break;
        case 'sale date':
          data.sort((a, b) => new Date(a.SALE_DATE) - new Date(b.SALE_DATE));
          break;
        default:
          break;
      }
      displayTable()
    }
    function filter() {
      const filterKey = document.getElementById('filter-key').value;
      const filterValue = document.getElementById('filter-value').value;
      const filterMonth = filterValue.padStart(2, '0');

      let filteredData = [];

      switch (filterKey) {
        case 'borough':
          filteredData = data.filter(item => item.BOROUGH.toString().toLowerCase() === filterValue.toLowerCase());
          break;
        case 'building class category':
          filteredData = data.filter(item => item.SALE_DATE.toLowerCase().includes(filterValue.toLowerCase()));
          break;
        case 'sale month': // If filtering by sale date
          // Assuming filterValue is the month in number format (e.g., "02" for February)
          filteredData = data.filter(item => {
            // Convert SALE_DATE to Date object
            const saleDate = new Date(item.SALE_DATE);
            // Get the month in number format (with leading zero)
            const saleMonth = (saleDate.getMonth() + 1).toString().padStart(2, '0');
            
            // Check if the month matches the filter value
            return saleMonth === filterMonth; // Ensure filterValue is also two digits
        });
          break;
        default:
          console.log('Filter key is not recognized');
          return; // If no recognized filter key, exit the function
      }
      

      // Retrieve and clear the existing tbody in the table
      var table = document.getElementById("data-table");
      var oldTbody = table.querySelector("tbody");
      if (oldTbody) {
        table.removeChild(oldTbody);
      }

      // Create a new tbody element
      var newTbody = document.createElement("tbody");
      if (filterValue === "") {
        displayTable()
      } else {

        // Append rows based on filteredData
        filteredData.forEach(datas => {
          var row = document.createElement('tr');
          row.innerHTML = `<td>${datas['BOROUGH']}</td>
                           <td>${datas['NEIGHBORHOOD']}</td>
                           <td>${datas['BUILDING_CLASS_CATEGORY']}</td>
                           <td>${datas['TAX_CLASS_AT_PRESENT']}</td>
                           <td>${datas['BLOCK']}</td>
                           <td>${datas['LOT']}</td>
                           <td>${datas['EASE_MENT'] || ''}</td>
                           <td>${datas['BUILDING_CLASS_AT_PRESENT']}</td>
                           <td>${datas['ADDRESS']}</td>
                           <td>${datas['APARTMENT_NUMBER'] || ''}</td>
                           <td>${datas['ZIP_CODE']}</td>
                           <td>${datas['RESIDENTIAL_UNITS']}</td>
                           <td>${datas['COMMERCIAL_UNITS']}</td>
                           <td>${datas['TOTAL_UNITS']}</td>
                           <td>${datas['LAND_SQUARE_FEET']}</td>
                           <td>${datas['GROSS_SQUARE_FEET']}</td>
                           <td>${datas['YEAR_BUILT']}</td>
                           <td>${datas['TAX_CLASS']}</td>
                           <td>${datas['BUILDING_CLASS_AT_TIME_OF_SALE']}</td>
                           <td>${datas['SALE_PRICE']}</td>
                           <td>${datas['SALE_DATE']}</td>`;
          newTbody.appendChild(row);
        });

        // Append the new tbody to the table
        table.appendChild(newTbody);
      }
      array = filteredData

    }


    // ini juga
    function displayIndexButtons() {
      preLoadCalculation() // Pastikan fungsi ini didefinisikan jika diperlukan
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
        prevIndex()
        // Tambahkan logika Anda di sini
      });

      // Menambahkan tombol-tombol indeks
      for (var i = 1; i <= max_index; i++) {
        var indexButton = document.createElement("button");
        indexButton.textContent = i;
        indexButton.setAttribute('data-index', i);
        indexButton.addEventListener("click", function () {
          current_index = this.getAttribute('data-index'); // Mengambil nilai indeks dari atribut data-index
          indexPagination(current_index)
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
        nextIndex()
        // Tambahkan logika Anda di sini
      });
      highlightIndex()
    }
    function highlightIndex() {
      start_index = ((current_index - 1) * table_size) + 1
      end_index = (start_index + table_size) - 1
      if (end_index > array_length) {
        end_index = array_length
      }

      // Mengupdate teks dalam elemen span dengan kelas pagination_button
      var paginationSpan = document.querySelector(".pagination_button span");
      paginationSpan.textContent = `Showing ${start_index} to ${end_index} of ${array_length} entries`;

      // Menghapus kelas 'active' dari semua tombol dengan kelas index_button
      var indexButtons = document.querySelectorAll(".index_button button");
      indexButtons.forEach(function (button) {
        button.classList.remove('active');
      });

      // Menambahkan kelas 'active' pada tombol dengan atribut index yang sesuai
      var activeButton = document.querySelector(`.index_button button[index="${current_index}"]`);
      if (activeButton) {
        activeButton.classList.add('active');
      }
      displayTable()

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

      data.slice(tab_start, tab_end + 1).forEach(datas => {
        var row = document.createElement('tr');
        row.innerHTML = `
      <td>${datas['BOROUGH']}</td>
      <td>${datas['NEIGHBORHOOD']}</td>
      <td>${datas['BUILDING_CLASS_CATEGORY']}</td>
      <td>${datas['TAX_CLASS_AT_PRESENT']}</td>
      <td>${datas['BLOCK']}</td>
      <td>${datas['LOT']}</td>
      <td>${datas['EASE_MENT']}</td>
      <td>${datas['BUILDING_CLASS_AT_PRESENT']}</td>
      <td>${datas['ADDRESS']}</td>
      <td>${datas['APARTMENT_NUMBER']}</td>
      <td>${datas['ZIP_CODE']}</td>
      <td>${datas['RESIDENTIAL_UNITS']}</td>
      <td>${datas['COMMERCIAL_UNITS']}</td>
      <td>${datas['TOTAL_UNITS']}</td>
      <td>${datas['LAND_SQUARE_FEET']}</td>
      <td>${datas['GROSS_SQUARE_FEET']}</td>
      <td>${datas['YEAR_BUILT']}</td>
      <td>${datas['TAX_CLASS']}</td>
      <td>${datas['BUILDING_CLASS_AT_TIME_OF_SALE']}</td>
      <td>${datas['SALE_PRICE']}</td>
      <td>${datas['SALE_DATE']}</td>
    `;
        newTbody.appendChild(row);
      });

      // Menambahkan tbody baru ke tabel
      table.appendChild(newTbody);

    }

    function nextIndex() {
      if (current_index < max_index) {
        current_index++
        highlightIndex()
      }
    }
    function prevIndex() {
      if (current_index > 1) {
        current_index--
        highlightIndex()
      }
    }
    function indexPagination(index) {
      current_index = parseInt(index)
      highlightIndex()
    }

    displayIndexButtons()

    document.getElementById('sort-button').addEventListener('click', sorting);
    document.getElementById('filter-button').addEventListener('click', filter);
    // Inisialisasi tampilan awal (opsional, bisa dipanggil saat halaman dimuat)
    preLoadCalculation();

  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

