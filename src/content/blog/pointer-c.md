---
title: 'Pointer di bahasa pemrograman C'
description: 'Lorem ipsum dolor sit amet'
pubDate: 'Mar 03 2025'
heroImage: '../../assets/blog-placeholder-3.jpg'
---

## Penjelasan Pointer

Pointer secara sederhana adalah variable yang menyimpan alamat sebagai penunjuk ke variable lain. Sebelum membahas lebih lanjut alangkah baiknya kita pahami dulu bagaimana memori menyimpan sebuah variable, perhatikan gambar di bawah ini.

![](/images/pointer-1.png)

Anggap saja di dalam memori ada blok-blok kecil tempat menyimpan nilai variable kita, setiap bloknya memiliki alamat yang unik untuk menunjukkan posisinya. Saat kita membuat variable misalnya a = 10, nilai 10 ini akan disimpan di dalam blok yang memiliki alamat guna mengidentifikasi di mana data dari variable tersebut disimpan.

Lalu bagaimana dengan pointer? sama, seperti menyimpan variable biasa tetapi yang disimpan ke dalam memori bukanlah nilai yang sebenarnya melainkan alamat dari sebuah variable lainnya. Lebih jelasnya perhatikan gambar di bawah.

![](/images/pointer-2.png)

Seperti yang terlihat pada gambar di atas, ketika membuat pointer variable \*pointer\_a yang dimasukkan ke dalam blok memorinya adalah alamat dari variable lain yaitu variable a. Berikut contoh kode untuk deklarasi dan inisialisasi pointer.

```c
int a = 10;
int *pointer_a = &a;
```

Pointer dideklarasikan menggunakan tanda bintang (`*`). Pada contoh di atas, pointer\_a adalah sebuah pointer variable yang menunjuk ke alamat variable a, alamatnya diambil menggunakan operator ampersand (`&`).

Sekarang pointer\_a hanyalah sebuah penunjuk ke variable a, jika ingin mengakses nilai yang ditunjuk oleh pointer\_a, dapat menggunakan operator dereferensi (`*`). Berikut contohnya.

```c
int a = 10;
int *pointer_a = &a;
printf("%d\n", *pointer_a); // output: 10
```

JIka hanya ingin melihat alamat yang ditunjuk oleh pointer\_a tinggal hapus saja operator dereferensi-nya dan ubah format printnya menjadi %p. Berikut contohnya.

```c
int a = 10;
int *pointer_a = &a;
printf("%p\n", pointer_a); // output: 0x7ffc6166339c (akan berbeda setiap kali dijalankan)
```

Kita juga bisa mengubah nilai a melalui pointer\_a dengan operator dereferensi kemudian diisi dengan nilai barunya, berikut contohnya.

```c
int a = 10;
int *pointer_a = &a;
printf("%d\n", *pointer_a); // output: 10
*pointer_a = 20;
printf("%d\n", a); // output: 20
```

Yang perlu diingat adalah jika ingin mengakses nilai aslinya, dengan menggunakan operator dereferensi (`*`), jika tidak menggunakan operator ini kita hanya mengakses alamat variable a saja. Jadi, jika nilai yang sebenarnya (variable a) sudah diganti melalui pointer variable (variable pointer\_a) maka nilai dari variable yang ditunjuk (variable a) pun akan berubah, begitu juga dengan variable lainnya jika ada yang menunjuk ke variable yang sama. Berikut contohnya.

```c
int a = 10;
int *pointer_a = &a;
int *pointer_lainnya = &a;

printf("%d\n", a); // output: 10
printf("%d\n", *pointer_a); // output: 10
printf("%d\n", *pointer_lainnya); // output: 10

*pointer_a = 20; // nilai yang sebenarnya diubah menjadi 20

printf("%d\n", a); // output: 20
printf("%d\n", *pointer_a); // output: 20
printf("%d\n", *pointer_lainnya); // output: 20
```

## Pointer dan Array

Pointer juga seringkali digunakan untuk bekerja dengan array karena nama variable array adalah penunjuk atau pointer ke elemen pertama dari array tersebut. Berikut contohnya.

```c
int arr[3] = {1, 2, 3};
int *pointer_arr = arr;
```

Jadi, ketika kita print dengan operator dereferensi pointer\_arr nya yang keluar adalah elemen pertama dari array-nya.

```c
int arr[3] = {1, 2, 3};
int *pointer_arr = arr;
printf("%d\n", *pointer_arr); //output: 1
```

Oleh karena itu, kita bisa mengakses elemen-elemen lain dari array dengan operator aritmatika ke pointer, untuk mengakses elemen kedua dan seterusnya kita tinggal menambahkan indeks elemen yang ingin diakses dari array. Berikut contohnya.

```c
int arr[3] = {1, 2, 3};
int *pointer_arr = arr;
printf("%d\n", *pointer_arr); //output: 1
printf("%d\n", *(pointer_arr+1)); //output: 2
printf("%d\n", *(pointer_arr+2)); //output: 3
```

## Pointer dan String

Tipe data string sebenarnya tidak secara explisit ada di C, membuat string dapat dideklarasikan dengan array of char. Misalnya kita memiliki string:

```c
char name[] = "Budi";
```

String akan disimpan di memori sebagai array dari karakter ‘B’, ‘u’, ‘d’, ‘i’, ‘\\0’ (null terminator yang menandakan akhir dari string).

Seperti yang sudah dijelaskan sebelumnya, pointer bisa digunakan untuk bekerja dengan array, dan string adalah array dari karakter. Maka string juga bisa dideklarasikan secara langsung sebagai pointer char. Berikut contohnya.

```c
char *name = "Budi";
```

Jadi, variable name pada contoh di atas ini adalah pointer yang menunjuk ke alamat di mana karakter ‘B’ dituju dan karakter-karakter berikutnya berada di alamat memori yang berurutan.

## Pointer ke pointer

Sebenarnya pointer juga bisa menunjuk ke pointer lainnya. Berikut contohnya.

```c
int b = 10;
int *p = &b;
int **pp = &p;

printf("%d\n", **pp);
```

Pada contoh di atas, variable pp berisi alamat penunjuk ke variable p yang di mana variable p ini juga menunjuk ke alamat variable b.

## Function Pointer

Function pointer adalah sebuah pointer yang menunjuk ke sebuah function. Sama seperti variable, function juga disimpan di memori, dan kita dapat menggunakan pointer sebagai penunjuk ke alamat function tersebut. Di bahasa pemrograman modern seperti golang atau javascript, function dapat diperlakukan sebagai value dari variable atau sebagai parameter yang biasa disebut callback di javascript. Di C semua ini bisa dilakukan dengan function pointer. Sebagai contoh misalnya kita mempunyai function sebagai berikut.

```c
int add(int a, int b) {
    return a + b;
}
```

Untuk membuat pointer yang menunjuk ke function di atas, kita bisa mendeklarasikan pointer sebagai berikut.

```c
// return_type (*pointer_name)(parameter_types);
int (*function_pointer)(int, int);
```

Dari deklarasi di atas :

* int adalah return type dari functionnya (function add mengembalikan int)
    
* function\_pointer adalah nama pointer yang akan menampung alamat functionnya
    
* (int, int) adalah type dari parameter functionnya
    

Untuk memasukan function add di atas ke dalam pointer-nya, kita bisa langsung memasukan nama function-nya kedalam pointer tersebut.

```c
int (*function_pointer)(int, int);
function_pointer = add; // add adalah function di atas
```

Cara menggunakan function pointer sama saja seperti menggunakan function biasa.

```c
int (*function_pointer)(int, int);
function_pointer = add;

int result = function_pointer(2 + 1);
printf("%d\n", result); // Output: 3
```

Keunggulan dari function pointer ini kita bisa gunakan function sebagai parameter di function yang lain, konsep ini disebut [higher-order function](https://en.wikipedia.org/wiki/Higher-order_function). Berikut adalah contoh lengkap penggunaan function pointer sebagai parameter.

```c
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int subtract(int a, int b) {
    return a - b;
}

int multiply(int a, int b) {
    return a * b;
}

// nama parameter operator ini yang akan kita masukkan nama functionnya
void calculate(int (*operator)(int, int), int a, int b) {
    int result = operator(a, b);
    printf("%d\n", result);
}

int main() {
    calculate(add, 5, 3); // output: 8
    calculate(subtract, 5, 3); // output: 2
    calculate(multiply, 5, 3); //output: 15

    return 0;
}
```

## Konklusi

* Pointer adalah konsep penting dalam bahasa pemrograman C yang memungkinkan pengelolaan memori secara efisien.
    
* Dengan memahami cara kerja pointer, kita dapat menyimpan alamat dari variabel lain, mengakses dan memodifikasi nilai variabel tersebut, serta bekerja dengan array dan string secara lebih fleksibel.
    
* Selain itu, pointer juga memungkinkan penggunaan fungsi sebagai parameter, yang dikenal sebagai higher-order function.