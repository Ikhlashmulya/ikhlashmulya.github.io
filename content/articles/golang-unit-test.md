---
title: Go-Lang Unit Test
type: page
description: Click on me to see the content.
topic: programming
date: 2023-05-24T11:30:03+00:00
---

### Pengertian Unit Test
Unit Test adalah bagian dari proses pengembangan perangkat lunak di mana bagian aplikasi terkecil diuji secara individual dan independen untuk mendapatkan hasil yang tepat. Metodologi pengujian ini dilakukan selama proses pengembangan oleh Software Developer. Tujuan utama dari unit test adalah untuk menguji dan menentukan apakah bagian dari aplikasi berfungsi sebagaimana dimaksud.

### Unit Test Di Go-Lang
Di bahasa pemrograman golang untuk melakukan unit test sudah disediakan package sendiri yang bernama `testing` untuk membuat unit test di golang terdapat aturan khusus, untuk membuat file unit test kita harus menggunakan akhiran _test pada nama file dan untuk functionnya diawali dengan Test, misal kita akan melakukan test terhadap function HelloWorld() maka nama function untuk unit test tersebut adalah TestHelloWorld() selanjutnya di dalam parameter test harus memiliki parameter (T *testing.T) dan tidak mereturn value apapun, sebagai contoh perhatikan kode di bawah : 

```
func HelloWorld() {
    return "Hello World"
}
```
maka jika kita ingin melakukan unit test, bisa menulis kode berikut : 
```
func TestHelloWorld(t *testing.T) {
    result := HelloWorld()
    if result != "Hello World" {
        //unit test failed
    }
}
```

Untuk menjalankan unit test bisa menggunakan perintah : 
- `go test`
- `go test -v` untuk verbose atau menampilkan detail dari unit test
- `go test -v -run TestNamaFunction` untuk menjalankan salah satu function saja

### Menggagalkan unit test
Sebelumnya kita sudah tahu bagaimana penulisan unit test di golang, sekarang bagaimana jika hasil dari function itu tidak sesuai dengan yang kita harapkan, di golang sendiri menyediakan 4 function untuk menggagalkan unit test : 
- `t.Fail()` untuk menggagalkan unit test namun terus melanjutkan eksekusi unit test
- `t.FailNow()` untuk menggagalkan unit test tanpa melanjutkan eksekusi unit test
- `t.Error()` sama seperti `t.Fail()` namun bisa menambahkan pesan kesalahan
- `t.Fatal()` sama seperti `t.FailNow()` namun bisa menambahkan pesan kesalahan

contoh :
```
func TestHelloWorld(t *testing.T) {
    result := HelloWorld()
    if result != "Hello World" {
        // t.Fail()
        t.Error("result must be Hello World")
    }
    // function setelahnya masih akan tetap dieksekusi
}
```
```
func TestHelloWorld(t *testing.T) {
    result := HelloWorld()
    if result != "Hello World" {
        // t.FailNow()
        t.Fatal("result must be Hello World")
    }
    // function setelahnya tidak akan dieksekusi
}
```

### Library Testify
Untuk melakukan assertion tidak disarankan menggunakan cara di atas, karena kode kita akan banyak sekali if-else, untuk mempermudah assertion bisa menggunakan library testify. Untuk menggunakan testify bisa menambahkan nya ke go module kita dengan cara `go get github.com/stretchr/testify` berikut contoh dalam penggunaan testify untuk assertion : 
```
func TestHelloWorldAssert(t *testing.T) {
    result := HelloWorld()
    assert.Equal(t, "Hello World", result, "Result must be 'Hello World'")
    //assert.Equal(t, expected, actual, message)

    fmt.Println("testing done!")
}
```
atau bisa menggunakan require, perbedaan assert dengan require adalah assert seperti t.Fail() dan t.Error() sedangkan require sama seperti t.FailNow() dan t.Fatal()
```
func TestHelloWorldRequire(t *testing.T) {
    result := HelloWorld()
    require.Equal(t, "Hello World", result, "Result must be 'Hello World'")
    //require.Equal(t, expected, actual, message)

    fmt.Println("testing done!")
}
```

### Membatalkan Unit Test
di dalam keadaan tertentu kadang kita ingin membatalkan unit test, untuk membatalkan unit test bisa menggunakan `t.Skip(message)`
```
func TestSkip(t *testing.T) {
    if runtime.GOOS == "linux" {
    	t.Skip("Cannot run on linux")
    }

    result := HelloWorld()
    require.Equal(t, "Hello World", result, "Result must be 'Hello World'")
}
```
kode di atas unit test akan dibatalkan jika runtime os nya adalah linux

### Sub Test
di golang dapat mendukung sub test atau di dalam sebuah unit test kita bisa menambahkan sub unit test sebanyak-banyaknya
```
func TestSubTest(t *testing.T) {
    t.Run("nama sub test", func(t *testing.T) {
    	result := HelloWorld()
    	require.Equal(t, "Hello World", result, "Result must be 'Hello World'")
    })
    t.Run("mulya", func(t *testing.T) {
    	result := HelloWorld()
        require.Equal(t, "Hello World", result, "Result must be 'Hello World'")
    })
}
```

### Table Test
fitur sub test biasa digunakan dengan konsep table test yaitu membuat sub test secara dinamis dengan cara menampung semua data di dalam slice dan melakukan iterasi
```
func DisplayNumber(number int) string {
    return "Display " + strconv.Itoa(number)
}

func TestTableTest(t *testing.T) {
    tests := []struct {
    	name     string
    	expected string
    	request  int 
    }{
    	{
    	    name:     "DisplayNumber(1)",
    	    expected: "Display 1",
    	    request:  1,
    	},
    	{
    	    name:     "DisplayNumber(2)",
    	    expected: "Display 2",
    	    request:  2,
    	},
    }

    for _, test := range tests {
        t.Run(test.name, func(t *testing.T) {
    	    result := SayHello(test.request)
    	    require.Equal(t, test.expected , result, "Result must be 'Hello Ikhlash'")
        })
    }
}
```
dibanding dengan membuat sub test satu satu cara ini jauh lebih baik