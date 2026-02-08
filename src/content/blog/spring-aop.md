---
title: 'Spring: Aspect Oriented Programming'
description: 'Lorem ipsum dolor sit amet'
pubDate: 'Nov 30 2025'
heroImage: '../../assets/blog-placeholder-5.jpg'
---

Aspect Oriented Programming (AOP) adalah paradigma pemrograman yang bertujuan untuk meningkatkan modularitas dengan memisahkan cross-cutting concern (masalah lintas bagian di aplikasi) dari inti logika aplikasi. Simple-nya memisahkan fungsionalitas yang umum seperti logging, caching, atau security terpisah dari logika bisnis aplikasi. Fungsionalitas tersebut dikumpulkan di suatu tempat kemudian disisipkan ke dalam logika bisnis aplikasi, tempat berkumpulnya fungsionalitas-fungsionalitas terebut disebut aspect. Dengan AOP, developer dapat menambahkan fungsionalitas ini ke kode yang sudah ada tanpa mengubah struktur kode aslinya. Bayangkan kita tidak harus nulis __log.info("start method")__ di setiap method, AOP bisa otomatis tambahkan logging ke semua method tanpa mengubah isi kodenya. Ini bikin kode modular, mudah maintain, dan reusable.

## Terminologi

Ada beberapa terminologi yang harus diketahui dalam AOP ini.

- Poincut: sebuah ekspresi/kondisi penanda kapan fungsionalitas tersebut harus disisipkan, seperti pada method tertentu yang ada di dalam suatu package.

- Join Point: titik spesifik dalam program di mana sebuah advice dapat disisipkan, seperti eksekusi sebuah metode.

- Advice: fungsionalitas yang akan kita sisipkan jika suatu method tersebut memenuhi syarat poincut.

- Aspect: tempat dimana kumpulan Advice dan Pointcut berada.

## AspectJ

Selain Spring AOP, ada framework native bernama AspectJ untuk menyisipkan fungsionalitas khusus ke dalam object/method saat kompilasi. Perbedaannya dengan spring AOP, dia benar-benar di-compile dan dimasukkan secara langsung kepada object/method target, sedangkan Spring AOP dia sebenarnya menggunakan proxy pattern untuk menyisipkan logika advice-nya. Artikel ini tidak akan  membahas AspectJ karena berfokus pada Spring AOP.

## Cara Kerja Spring AOP

Seperti yang sudah dijelaskan, Spring AOP ini menggunakan Proxy yang berjalan di runtime, tidak seperti AspectJ yang di-compile terlebih dahulu. Karena hanya berjalan di runtime, aspect di Spring hanya dapat diterapkan pada Spring-managed bean (Object yang dikelola Spring). Cara kerjanya sebagai berikut

1. Ketika Spring mendeteksi sebuah bean yang perlu dikenai advice (target object), ia akan membuat objek Proxy di sekitarnya.

2. Ketika method pada target object dipanggil, pemanggilan tersebut sebenarnya melalui objek Proxy terlebih dahulu.

3. Proxy kemudian akan mencegat panggilan tersebut dan mengeksekusi advice yang relevan (misalnya @Before), lalu meneruskan panggilan ke method asli, dan akhirnya mengeksekusi advice sisa (misalnya @AfterReturning).

## Pointcut Expression

Dalam Spring AOP, pointcut paling sering didefinisikan menggunakan bahasa ekspresi AspectJ Pointcut Language. Seperti yang sudah dibahas, pointcut adalah sebuah ekspresi/kondisi dimana advice harus diterapkan. Berikut adalah ekspresi-ekspresi yang dapat digunakan dalam Spring AOP.

### Eksekusi Method

execution() akan mencocokkan eksekusi sebuah method tertentu. Berikut adalah struktur sintaksnya.

```plain text
execution(modifier? return_type? declarating_type? name(args) throws?)
```

- Tanda tanya (?) menandakan bagian optional.

- Tanda bintang (\*) adalah wildcard yang cocok dengan apapun

- Titik dua (..) adalah wildcard yang cocok dengan nol atau lebih argumen

Berikut contoh-contoh expresi execution()

- __execution(* *(..))__ : Semua eksekusi method, di kelas mana pun, dengan argumen apa pun, dan tipe kembalian apa pun. (Sangat luas!)

- __execution(public * *(..))__ : Semua eksekusi method dengan modifier public, di kelas mana pun, dengan argumen apa pun, dan tipe kembalian apa pun.

- __execution(public * com.example.service.*.*(..))__ : Semua eksekusi method dengan modifier public, dengan return type apa pun, di dalam package com.example.service, di kelas mana pun, dan nama method apapun dengan argumen apa pun.

- __execution(public * com.example.service.UserService.*(..))__ : Semua eksekusi method dengan modifier public, dengan return type apa pun, di dalam package com.example.service, di kelas UserService, dan nama method apapun dengan argumen apa pun.

- __execution(public String com.example.service.*.get*(..))__ : Semua eksekusi method dengan modifier public, dengan return type String, di dalam package com.example.service, di kelas mana pun, dan nama method yang diawali dengan get dengan argumen apa pun.

- __execution(public String com.example.service.*.*(Long, ..))__ : Semua eksekusi method dengan modifier public, dengan return type String, di dalam package com.example.service, di kelas mana pun, dan nama method apa pun dengan argumen pertama bertipe Long dan argumen-argumen lain setelahnya (atau tidak ada).

- __execution(public * com.example.repo..*.*(..))__ : Semua eksekusi method dengan modifier public, dengan return apa pun, di dalam semua sub-package dari com.repo (termasuk com.repo.order, com.repo.user, dll.), di kelas mana pun, dan nama method apa pun dengan argumen apa pun.

### Within

__within()__ akan mencocokkan join point (eksekusi method) yang dideklarasikan di dalam tipe (kelas atau interface) yang ditentukan. Berikut contoh-contoh ekspresi within()

- __within(com.example.service.*)__ : Mencocokkan semua method yang dideklarasikan di semua kelas yang ada di dalam package com.example.service.

- __within(com.example.util..*)__ : Mencocokkan semua method yang dideklarasikan di semua kelas yang berada di package com.example.util dan semua sub-package-nya (com.example.util.db, com.example.util.date, dll.).

- __within(com.example.service.UserServiceImpl)__ : Mencocokkan semua method yang dideklarasikan di dalam kelas UserServiceImpl.

### Spesifikator Pointcut Lainnya

1. @annotation : Mencocokkan eksekusi method jika method tersebut memiliki anotasi tertentu. Contoh __@annotation(com.example.CustomLog)__ ini akan match di semua method yang memiliki annotation CustomLog.

2. @within : Mencocokkan method jika kelas/tipe yang mendeklarasikannya memiliki anotasi tertentu. Contoh __@within(org.springframework.stereotype.Service)__ ini akan match di semua method yang ada di kelas yang memiliki annotation Service.

3. @bean : Mencocokkan method pada bean yang memiliki ID atau nama tertentu. Contoh __bean(userService)__, ini akan match semua public method pada bean bernama "userService".

4. args() : Mencocokkan eksekusi method berdasarkan tipe argumen yang diterimanya. Urutan dan jumlah argumen itu penting. Contoh __args(Long, ..)__ ini akan match dengan method apa pun yang menerima argumen pertama bertipe Long, diikuti oleh argumen apa pun (atau tidak ada) atau __args(.., Long)__ ini akan match dengan method apa pun yang menerima argumen terakhir bertipe Long.

5. @args : mencocokkan eksekusi method jika tipe argumen memiliki anotasi tertentu. Contoh __@args(com.contoh.annotation.ValidatableDTO, ..)__ ini akan match dengan method yang argumen pertamanya adalah objek yang kelasnya dianotasi dengan @ValidatableDTO

## Deklarasi Aspect

Aspect dideklarasikan dengan kelas dengan annotation @Aspect, kelas ini yang nantinya akan menampung poincut dan advice. Berikut cara mendeklarasikan Aspect.

```java
@Aspect
@Component
public class LoggingAspect {
}
```

## Deklarasi Advice

Ada lima jenis advice utama. Semua jenis ini dideklarasikan sebagai method biasa di dalam kelas @Aspect, dan ditandai dengan anotasi advice yang sesuai.

### Before Advice

Advice ini akan dijalankan sebelum method target dieksekusi. Berikut contohnya.

```java
@Before("execution(* com.example.service.*.*(..))") // isi dengan poincut
public void logBefore(JoinPoint joinPoint) {
    // method ini akan dijalankan sebelum method target
    System.out.println("ADVICE @Before: Before execution method in com.example.service");
}
```

### After Advice

Advice ini akan dijalankan setelah method target selesai, terlepas dari hasilnya (baik sukses atau melempar exception). Ini seperti blok finally. Berikut contohnya

```java
@After("execution(* com.example.service.*.*(..))")
public void logAfterexecution(* com.example.service.*.*(..))JoinPoint joinPoint) {
    // method ini akan dijalankan setelah method target
    System.out.println("ADVICE @After: After execution method in com.example.service");
}
```

### After Returning Advice

Advice ini akan dijalankan setelah method target selesai dengan sukses (mengembalikan nilai, tanpa melempar exception). Berikut contohnya

```java
@AfterReturning(
    pointcut = "execution(* com.example.service.*.*(..))",
    returning = "result" // 'result' akan memegang nilai kembalian dari method target
)
public void logAfterReturning(JoinPoint joinPoint, Object result) {
    // Logika dijalankan setelah method sukses dan mendapatkan hasilnya
    System.out.println("ADVICE @AfterReturning: Method executed. Result: " + result);
}
```

### After Throwing Advice

Advice ini akan dijalankan setelah method target keluar dengan melempar exception. Berikut contohnya

```java
@AfterThrowing(
    pointcut = "execution(* com.example.service.*.*(..))",
    throwing = "e" // 'e' akan memegang exception yang dilempar
)
public void logAfterThrowing(JoinPoint joinPoint, Throwable e) {
    // Logika dijalankan setelah method melempar exception
    System.out.println("ADVICE @AfterThrowing: Exception occured in method. Error: " + e.getMessage());
}
```

### Around Advice

Advice ini seperti gabungan before dan after, akan dijalankan diantara sebelum dan sesudah sekaligus. Berikut contohnya.

```java
@Around("execution(* com.example.service.*.*(..))")
public Object logAround(ProceedingJoinPoint pjp) throws Throwable {
    long start = System.currentTimeMillis();

    // 1. Logika sebelum method target
    System.out.println("ADVICE @Around (Pre): executing...");

    // **2. Eksekusi Method Target ASLI**
    Object hasil = pjp.proceed();

    // 3. Logika setelah method target
    long end = System.currentTimeMillis();
    System.out.println("ADVICE @Around (Post): Method executed in " + (end - start) + "ms.");

    // 4. Mengembalikan hasil method target
    return hasil;
}
```

### Deklarasi Pointcut terpisah

Dalam mendeklarasikan advice, kita pasti ingin menerapkan advice yang sama pada satu pointcut, contohnya sebagai berikut.

```java
@Aspect
@Component
public class LoggingAspect {

    @Before("execution(* com.example.service.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        System.out.println("Before service");
    }

    @After("execution(* com.example.service.*.*(..))")
    public void logAfter(JoinPoint joinPoint) {
        System.out.println("After service");
    }

}
```

Kode seperti di atas pastinya akan menyusahkan kita dan membuat kode tidak rapi. Agar lebih rapi, kita bisa mendeklarasikan pointcut di method khusus:

```java
@Aspect
@Component
public class LoggingAspect {

    @PointCut("execution(* com.example.service.*.*(..))")
    public void serviceMethods() {}

    @Before("serviceMethods()")
    public void logBefore(JoinPoint joinPoint) {
        System.out.println("Before service");
    }

    @After("serviceMethods()")
    public void logAfter(JoinPoint joinPoint) {
        System.out.println("After service");
    }

}
```

### Kombinasi PointCut

Beberapa pointcut juga bisa dikombinasikan menggunakan operator &&, ||, ! Contohnya sebagai berikut

```java
@Aspect
@Component
public class LoggingAspect {

    @Pointcut("within(com.app.service..*)")
    public void inService() {}

    @Pointcut("@annotation(org.springframework.transaction.annotation.Transactional)")
    public void transactionalMethods() {}

    @Before("inService() && transactionalMethods()")
    public void log() {
        System.out.println("Called a transactional service method");
    }

}
```

## Object JoinPoint

Objek JoinPoint adalah interface yang disediakan oleh Spring AOP (bagian dari package __org.aspectj.lang__) yang memberikan informasi tentang join point yang sedang dieksekusi. Objek JointPoint dapat diakses di semua advice kecuali @Around

### Mendapatkan Informasi Method (Signature)

JoinPoint menyediakan method untuk mendapatkan representasi dari method yang sedang dieksekusi, dapat diambil dengan method __getSignature()__ yang akan mengembalikan objek Signature.

Dari objek Signature yang dikembalikan, kita dapat memanggil beberapa method berikut.

1. __getName()__ : nama method yang dieksekusi. Contoh nilai "saveUser"

2. __getDeclaringTypeName()__ : mama kelas atau interface tempat method dideklarasikan. Contoh nilai "com.example.service.UserService"

3. __toShortString()__ : representasi signature singkat. Contoh nilai "void saveUser(String)"

### Mendapatkan Objek Target (Target & This)

1. __getTarget()__ : Mengembalikan objek target yang sebenarnya (implementasi asli UserServiceImpl) yang sedang dikenai advice.

2. __getThis()__ : Mengembalikan objek proxy yang digunakan untuk memanggil method.

3. __getKind()__ : Mendapatkan jenis join point (misalnya: "method-execution")

### Mendapatkan Argumen

Kita dapat mengambil argumen yang diteruskan ke method target. Untuk mendapatkan argumen-argumen nya dengan menggunakan __getArgs()__ tipe yang akan dikembalikan adalah __Object[]__

## Object ProceedingJoinPoint

__ProceedingJoinPoint__ adalah subclass dari JoinPoint sehingga semua fitur JoinPoint bisa didapatkan oleh ProceedingJoinPoint, tetapi yang membedakan adalah adanya method __proceed()__ yang digunakan untuk melanjutkan eksekusi method target.

contoh dasarnya adalah sebegai berikut

```java
@Around("execution(* com.example.service.*.*(..))")
public Object measureTime(ProceedingJoinPoint pjp) throws Throwable {
    long start = System.currentTimeMillis();

    Object result = pjp.proceed(); // <-- menjalankan method target

    long end = System.currentTimeMillis();
    System.out.println("Time: " + (end - start));

    return result;
}
```

## Studi Kasus Sederhana

Sebagai studi kasus sederhana kita akan gunakan kasus menambahkan logging dengan aspect pada kelas __NotificationService__, sebelum itu ada dependency yang harus kita tambahkan terlebih dahulu.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

struktur project sebelumnya adalah seperti ini
```
├── PracticeApplication.class
├── provider
│   ├── EmailNotifier.class
│   └── Notifier.class
└── service
    └── NotificationService.class
```

kita akan coba membuat aspect untuk logging dari NotificationService
```java
@Service
public class NotificationService {
    private final Notifier notifier;

    @Autowired
    public NotificationService(Notifier notifier) {
        this.notifier = notifier;
    }

    public void send(String message) {
        notifier.notify(message);
    }
}
```

untuk membuat aspect, bikin saja class aspect nya di mana saja, biar lebih rapi simpan saja di dalam forder aspect seperti ini.
```
├── aspect
│   └── LoggingAspect.class
├── PracticeApplication.class
├── provider
│   ├── EmailNotifier.class
│   └── Notifier.class
└── service
    └── NotificationService.class
```

untuk membuat aspect tinggal bikin class dengan annotation Component dan Aspect

```java
@Aspect
@Component
public class LoggingAspect {

}
```

sebagai studi kasus sederhana saja, kita akan bikin logging sebelum dan sesudah notification dikirim, juga dengan pengukuran berapa lama method tersebut dijalankan.

Pertama kita bikin dulu pointcut nya, karena NotificationService ini berada di dalam service kita bisa bikin pointcut seperti ini.

```java
@Aspect
@Component
public class LoggingAspect {
    @Pointcut("execution(public * com.example.practice.service.*.*(..))")
    public void serviceMethods() {
    }
}
```

pointcut di atas itu artinya semua method public yang ada di dalam package com.example.practice.service. Kalo sudah bikin pointcut seperti itu tinggal bikin saja advice-nya seperti ini.

```java
@Aspect
@Component
public class LoggingAspect {

    @Pointcut("execution(* com.example.practice.service.*.*(..))")
    public void serviceMethods() {
    }

    @Before("serviceMethods()")
    void beforeSendingNotification(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        System.out.println("Method: " + methodName);
        System.out.println("Arguments: " + Arrays.toString(joinPoint.getArgs()));
    }

    @AfterReturning("serviceMethods()")
    void afterSendingNotification(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        System.out.println("Method '" + methodName + "' executed successfully");
        System.out.println("Arguments: " + Arrays.toString(joinPoint.getArgs()));
    }

    @Around("serviceMethods()")
    Object aroundSendingNotification(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        Object proceed = proceedingJoinPoint.proceed();
        long endTime = System.currentTimeMillis();

        System.out.println("Execution: " + proceedingJoinPoint.getSignature().toShortString() + " = " + (endTime - startTime));

        return proceed;
    }
}
```

- method __beforeSendingNotification__ akan dijalankan sebelum method service dijalankan dengan mengambil informasi nama method dari joinpoint nya
- method __afterSendingNotification__ akan dijalankan sebelum method service dijalankan dengan mengambil informasi nama method dari joinpoint nya
- method __aroundSendingNotification__ bisa dijalankan diantara sebelum dan sesudah method dieksekusi. Untuk menambah functional sebelum menjalankan method, tambahkan saja sebelum memanggil proceed(), begitu juga jika ingin menambahkan sesuatu setelah menjalankan method berarti tinggal tambahkan setelah proceed(). Dalam contoh di atas, kita mengambil waktu dalam mili sebelum dan setelah menjalankan method untuk dihitung berapa lama waktu eksekusi method tersebut.

## Penutup 
Aspect Oriented Programming (AOP) adalah paradigma pemrograman yang bertujuan untuk meningkatkan modularitas dengan memisahkan cross-cutting concern (masalah lintas bagian di aplikasi) dari inti logika aplikasi. AOP ini sangat berguna jika kita ingin menambahkan fungsional yang umum seperti logging atau caching kepada method tanpa harus mengubah isi method-nya. Ini akan membuat kode menjadi lebih bersih dan rapih, karena memisahkan logika logging dari logika inti.