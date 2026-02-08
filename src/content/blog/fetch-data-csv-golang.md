---
title: 'Fetch Data CSV di Go-Lang'
description: 'Lorem ipsum dolor sit amet'
pubDate: 'Mar 15 2023'
heroImage: '../../assets/blog-placeholder-2.jpg'
---

### Membaca data dari csv
Untuk membaca data CSV di Golang, bisa menggunakan package standar `encoding/csv` yang sudah disediakan oleh Go. Berikut ini adalah contoh kode untuk membaca file CSV :

```go
package main

import (
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"os"
)

func main() {
	file, err := os.Open("data.csv")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.Comma = ','

	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}

		fmt.Println(record)
	}
}
```

Pembahasan potongan kode : 

- Membuka file

```go
file, err := os.Open("data.csv")
if err != nil {
	log.Fatal(err)
}
defer file.Close()
```

potongan kode di atas adalah untuk membuka file csv yang akan dibaca. Untuk membuka file menggunakan fungsi open dari package os

- Membuat reader csv
```go
reader := csv.NewReader(file)
reader.Comma = ','
```
Untuk membuat reader csv gunakan fungsi NewReader dari package encoding/csv kemudian simpan ke dalam variable, jangan lupa set delimiter sesuai dengan file csv-nya.

- Membaca baris per baris

Untuk membaca satu baris file csv bisa menggunakan :
```go
record, err := reader.Read()
if err != nil {
	log.Fatal(err)
}
fmt.Println(record)
```
hasil dari fungsi `reader.Read()` mengembalikan dua nilai, error dan hasil record nya (reader berasal dari variable pembaca yang sudah dibuat di atas menggunakan `csv.Reader()`) jika ada error dapat diketahui dengan melakukan pengecekan terhadap variable err.


hasil record nya berupa slice of string ([]string) yang dapat dibaca langsung melalui fmt.Println.


untuk membaca ke semua baris dapat menggunakan perulangan : 
```go
for {
	record, err := reader.Read()
	if err == io.EOF {
		break
	}
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(record)
}
```

`if err == io.EOF` disana untuk mengecek apabila error yang dikembalikan adalah akhir dari file  maka perulangan akan berhenti.


### Menyimpan ke database

Kita bisa menyimpan langsung ke database hasil dari record nya, berikut kode untuk membaca data dari csv dan langsung disimpan ke database (sebagai contoh kode berikut untuk membaca data quote anime) : 

```go
package main

import (
	"database/sql"
	"encoding/csv"
	"io"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

type QuoteAnime struct {
	Id        string
	Anime     string
	Character string
	Quote     string
}

func getConnection() *sql.DB {
	db, err := sql.Open("mysql", "root:@/namadatabase")
	fatalErr(err)

	db.SetMaxIdleConns(10)
	db.SetMaxOpenConns(100)

	return db
}

func fatalErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func main() {

	records := make(chan QuoteAnime)

	file, err := os.Open("data.csv")
	fatalErr(err)

	go func() {
		reader := csv.NewReader(file)
		reader.Comma = ';'

		defer close(records)

		for {
			r, err := reader.Read()
			if err == io.EOF {
				break
			}
			fatalErr(err)

			var record QuoteAnime
			record.Id = r[0]
			record.Anime = r[1]
			record.Character = r[2]
			record.Quote = r[3]

			records <- record
		}
	}()

	print_record(records)
}

func print_record(records chan QuoteAnime) {

	db := getConnection()
	defer db.Close()

	stmt, err := db.Prepare("INSERT INTO quotes_anime (anime, character_name, quote) VALUES (?,?,?)")
	fatalErr(err)

	for record := range records {
		_, err := stmt.Exec(record.Anime, record.Character, record.Quote)
		fatalErr(err)
		log.Println("Data dengan id :", record.Id, "berhasil disimpan")

	}

	log.Println("Semua Data Berhasil Disimpan")
}
```


Pembahasan potongan kode : 

- Menyiapkan representasi dari dari csv 
```go
type QuoteAnime struct {
	Id        string
	Anime     string
	Character string
	Quote     string
}
```

- Menyiapkan koneksi ke database 
```go
func getConnection() *sql.DB {
	db, err := sql.Open("mysql", "root:@/namadatabase")
	fatalErr(err)

	db.SetMaxIdleConns(10)
	db.SetMaxOpenConns(100)

	return db
}
```

- Membuat fungsi untuk error handling agar tidak mengulang setiap ada error
```go
func fatalErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
```


lanjut ke function main : 

- Membuat channel penampung data 

karena kita akan membaca datanya secara asynchronus menggunakan goroutine jadi wajib membuat channel untuk transfer data nya
```go
records := make(chan QuoteAnime)
```

- Membuka file csv
```go
file, err := os.Open("data.csv")
fatalErr(err)
```

- Membuat goroutine

untuk membuat goroutine-nya dapat menggunakan anonymous function seperti ini
```go
go func(){

}()
```
dan berikut di dalam goroutine-nya : 

- Membuat reader csv 
```go
reader := csv.NewReader(file)
reader.Comma = ';'

defer close(records)
```
`defer close(records)` untuk menutup channel jika program sudah selesai

- Membaca data 
```go
for{
	r, err := reader.Read()
	if err == io.EOF {
		break
	}
	fatalErr(err)

	var record QuoteAnime
	record.Id = r[0]
	record.Anime = r[1]
	record.Character = r[2]
	record.Quote = r[3]

	records <- record
}

```

caranya sama seperti yang sudah dijelaskan di atas tetapi ada tambahan untuk mengirim data ke channel yang ditampung melalui variable bertype struct, karena `r` adalah []string, jadi bisa langsung memasukan ke dalam struct sesuai urutan yang ada di file csv nya, dan kemudian kirimkan variable nya ke channel dengan `records <- record` data ini akan diterima oleh function setelahnya yaitu `print_record()`


berikut isi dari function print_record : 
- koneksi ke database dan menyiapkan query
```go
db := getConnection()
defer db.Close()

stmt, err := db.Prepare("INSERT INTO quotes_anime (anime, character_name, quote) VALUES (?,?,?)")
fatalErr(err)
```

`db` diisi dengan function yang sudah dibuat di atas, kemudian `db.Prepare` untuk meyiapkan query ke database yang nanti nya bisa dengan mudah pada saat eksekusi

- Menyimpan data dari channel ke database 
```go
for record := range records {
	_, err := stmt.Exec(record.Anime, record.Character, record.Quote)
	fatalErr(err)
	log.Println("Data dengan id :", record.Id, "berhasil disimpan")
}
```

gunakan perulangan for..range untuk mengambil data satu-satu dari channel records yang sudah dibuat di atas, kemudian lakukan `stmt.Exec` untuk mengeksekusi query yang sudah disiapkan di atas, jangan lupa untuk kasih parameter datanya, jika sudah dan tidak ada error maka akan menampilkan `log.Println("Data dengan id :", record.Id, "berhasil disimpan")`.


ketika semua data berhasil disimpan terakhir akan menampilkan pesan
```go
log.Println("Semua Data Berhasil Disimpan")
```
data sudah berhasil disimpan ke database.