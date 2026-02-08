---
title: 'Spring: Inversion of Control'
description: 'Lorem ipsum dolor sit amet'
pubDate: 'Nov 22 2025'
heroImage: '../../assets/blog-placeholder-2.jpg'
---

Inversion of Control (IoC) merupakan sebuah konsep di mana pengendalian pembuatan dan manajemen lifecycle (siklus hidup) objek (atau dependensi) tidak lagi dilakukan oleh kita, tetapi oleh container (Spring Framework).

Secara tradisional, kita sendiri lah yang membuat objek menggunakan operator `new`. Dengan IoC, kita hanya mendeklarasikan objeknya aja, dan Spring Container yang bertanggung jawab untuk membuat, mengkonfigurasi, dan menyuntikkan (meng-inject) objek-objek tersebut saat dibutuhkan.

Itulah kenapa konsep ini disebut inversion of control, karena kendali (kontrol) sebuah objek dibalik dari yang awalnya kita yang mengendalikan dan memanggil objek yang dibutuhkan; dengan IoC, Spring Framework lah yang akan mengendalikan pembuatan objek, mengelolanya, dan menyediakan objek yang kita butuhkan.

## IoC Container di Spring
Komponen inti dari Spring Framework adalah IoC Container, yang bertanggung jawab penuh untuk mengelola objek-objek aplikasi kita, Spring menyebutnya Beans.

1. Spring Bean

Bean adalah objek yang di-instantiate, di-assemble, dan diatur lifecycle-nya oleh Spring IoC Container.

2. Jenis IoC container

Ada 2 jenis container di spring BeanFactory dan ApplicationContext
- BeanFactory : versi paling basic dari IoC container Spring yang hanya menyediakan dependency injection dan bean lifecycle management
- ApplicationContext : ini merupakan sebuah ekstensi dari BeanFactory dengan fitur yang lebih banyak

## Praktik IoC di Spring

Oke langsung aja kita praktik untuk memahami IoC, misalnya aja kita punya interface Animal dengan method makeNoise()

```java
public interface Animal {
    void makeNoise();
}
```

kemudian kita bikin konkret kelas nya 

```java
public class Cat implements Animal {
    @Override
    public void makeNoise() {
        System.out.println("Meeoowww");
    }
}

public class Dog implements Animal {
    @Override
    public void makeNoise() {
        System.out.println("Woofff");
    }
}
```

tanpa IoC kita akan membuat instansiasi nya manual seperti ini
```java
public class MainApplication {
    public static void main(String[] args) {
        Animal animal = new Dog();
        animal.makeNoise();
    }
}
```

kalo pake IoC di Spring kita tidak akan membuat objek seperti itu, tinggal daftarkan objek (bean) nya ke spring biar spring yang mengelola nya. Di spring ini ada dua macam cara untuk mendaftarkan objek nya bisa dengan XML-based configuration atau Java-based configuration. Di artikel ini hanya akan membahas lewat Java-based configuration karena di aplikasi spring modern biasanya memakai Java-based.

Pertama bikin dulu configuration class, tempat di mana bean-bean kita akan didaftarkan, untuk membuat configuration class tinggal bikin aja class dengan annotation @Configuration, dan gunakan @Bean  untuk mendaftarkan bean. Contohnya seperti ini

```java
@Configuration // Ini kayak bilang ke Spring: "Ini sumber konfigurasi bean!"
public class AppConfig {
    @Bean // Bean ini akan dibuat dan dikelola Spring
    Animal animal() {
        return new Cat(); // bisa ganti ke Dog() kalo mau ganti implementasi
    }
}
```

kalo udah bikin class kayak gitu tinggal masukin ke ApplicationContext dan cara mengambil objek yang sudah di daftarkan seperti ini.

```java
public class MainApplication {
    public static void main(String[] args) {
        ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
        // mengambil bean yang ada di AppConfig
        // parameter pertama nama method, parameter kedua tipe class nya
        Animal animal = context.getBean("animal", Animal.class);
        animal.makeNoise(); // output : Meeoowww
    }
}
```

Kelebihannya apa? ya jadi enak dalam melakukan dependency injection, karena objek dikelola oleh spring framework, nanti kita akan lihat contoh meng-inject objek nya.

## Dependency Injection
sebagai contoh kasus, misalnya kita punya NotificationService yang butuh dependensi Notifier. Kita akan meng-inject Notifier ke NotificationService

Bikin kontrak interface dan implementasinya terlebih dahulu
```java
public interface Notifier {
    void notify(String message);
}

public class EmailNotifier implements Notifier {
    @Override
    public void notify(String message) {
        System.out.println("sending to email : " + message);
    }
}

public class SmsNotifier implements Notifier {
    @Override
    public void notify(String message) {
        System.out.println("sending to SMS : " + message);
    }
}
```

kemudian ini kelas yang butuh Notifier 
```java
public class NotificationService {
    private final Notifier notifier;

    public NotificationService(Notifier notifier) {
        this.notifier = notifier;
    }

    public void send(String message) {
        notifier.notify(message);
    }
}
```

daftarkan semua bean-nya dan untuk inject object nya di configuration class nya seperti ini
```java
@Configuration
public class AppConfig {
    @Bean // daftarkan Bean dan akan dikelola Spring
    Notifier notifier() {
        return new EmailNotifier(); // Bisa ganti implementasi lain kalau mau
    }

    @Bean
    NotificationService notificationService() {
        // DI manual: Panggil bean lain di sini → Spring otomatis inject!
        return new NotificationService(notifier());
    }
}
```

kalo udah di-inject di class configuration tinggal ambil aja NotificationService-nya dari container, otomatis Notifier nya udah di-inject

```java
public class MainApplication {
    public static void main(String[] args) {
        // Load configuration ke Spring Container
        ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
        
        // Ambil bean dari container
        NotificationService notificationService = context.getBean("notificationService", NotificationService.class);

        // Coba pakai → DI sudah jalan!
        notificationService.send("long message"); // output → sending to email : long message
    }
}
```

Sampai saat ini, kita masih melakukan DI manual di class configuration, ada cara yang lebih enak yaitu pake autowiring, tapi sebelum itu kita bahas dulu lifecycle dan scope. Dua konsep ini saling terkait, karena scope menentukan bagaimana lifecycle bean dikelola.

## Bean Lifecycle
Bean lifecycle adalah tahapan-tahapan yang akan dilalui oleh bean dari mulai pembuatan objek sampai penghancuran (destroy) sebuah objek dan ini semua sudah dikelola oleh spring

Tahapan-tahapan utama yang bean lalui setelah container dibuat
1. Bean Instantiated : container akan membuat instansiasi dari bean
2. Dependencies Injected : container akan meng-inject dependensi ke dalam bean
3. Initialization : Spring dapat menjalankan method tertentu setelah Bean selesai dibuat dan injection selesai (ini bisa kita custom)
4. Usage : Bean sudah siap dipakai
5. Destruction : Ketika Container ditutup (misalnya, saat aplikasi dimatikan), Spring akan membersihkan dan membuang Bean tapi sebelum itu akan menjalankan method tertentu (bisa custom juga)

Cara menjalankan method saat initialization dan destruction cukup bikin method tambahan saja di bean nya, misalnya di kasus notifier sebelumnya

```java
public interface Notifier {
    void startConnection();
    void notify(String message);
    void closeConnection();
}

public class EmailNotifier implements Notifier {
    @Override
    public void notify(String message) {
        System.out.println("sending to email" + message);
    }

    @Override
    public void closeConnection() {
        System.out.println("close connecting..");
    }

    @Override
    public void startConnection() {
        System.out.println("start connecting..");
    }
}

public class SmsNotifier implements Notifier {
    @Override
    public void notify(String message) {
        System.out.println("sending to SMS " + message);
    }

    @Override
    public void closeConnection() {
        System.out.println("close connecting..");
    }

    @Override
    public void startConnection() {
        System.out.println("start connecting..");
    }
}
```

Nah pada saat mendaftarkannya di @Bean, pakai initMethod dan destroyMethod seperti ini

```java
@Configuration
public class AppConfig {
    @Bean(initMethod = "startConnection", destroyMethod = "closeConnection")
    Notifier notifier() {
        return new SmsNotifier();
    }

    @Bean
    NotificationService notificationService() {
        return new NotificationService(notifier());
    }
}
```

coba jalankan sekarang pakai ConfigurableApplicationContext agar bisa di close secara manual
```java
public class MainApplication {
    public static void main(String[] args) {
        ConfigurableApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
        
        NotificationService notificationService = context.getBean("notificationService", NotificationService.class);

        notificationService.send("long message");

        context.close(); // akan memanggil destroy method
    }
}
```

output program di atas akan seperti ini
```
start connecting..
sending to SMS long message
close connecting..
```

Selain cara di atas bisa juga menggunakan annotation @PreDestroy dan @PostConstruct di atas method-nya seperti ini

```java
public class EmailNotifier implements Notifier {
    @Override
    public void notify(String message) {
        System.out.println("sending to email" + message);
    }

    @Override
    @PreDestroy
    public void closeConnection() {
        System.out.println("close connecting..");
    }

    @Override
    @PostConstruct
    public void startConnection() {
        System.out.println("start connecting..");
    }
}
```

## Bean Scope
Scope mengatur berapa lama hidup objek bean-nya, berapa banyak instance bean yang dibuat, serta kapan dibuat/dihancurkan. Singkatnya, mengatur pembuatan dari bean. 
Spring menyediakan 6 scope, berikut daftar lengkap scope (dari yang paling sering ke jarang)

|Scope      |Deskripsi Singkat                                                   |Jumlah Instance              |Kapan Dibuat?                                            |Kapan Dihancurkan?                                          |Use Case Utama                                                |
|-----------|--------------------------------------------------------------------|-----------------------------|---------------------------------------------------------|------------------------------------------------------------|--------------------------------------------------------------|
|singleton  |Satu instance global untuk seluruh container.                       |1 (shared)                   |Saat container start (eager) atau pertama dipakai (lazy).|Saat container shutdown.                                    |Service, Repository, Config – yang tidak punya state per user.|
|prototype  |Instance baru setiap kali di-request (via getBean() atau injection).|Sebanyak yang direquest.     |Saat pertama di-inject/getBean().                        |Tidak otomatis (kamu harus handle sendiri, atau biarkan GC).|Objek stateful seperti ShoppingCart atau RequestHandler.      |
|request    |Satu instance per HTTP request (hanya di web app).                  |1 per request.               |Awal request.                                            |Akhir request.                                              |Data sementara per request di web app (misal: form data).     |
|session    |Satu instance per HTTP session (hanya di web app).                  |1 per session.               |Awal session.                                            |Session expire/destroy.                                     |User-specific data seperti login info atau cart di browser.   |
|application|Satu instance per ServletContext (global untuk app).                |1 (shared seperti singleton).|Saat app start.                                          |Saat app shutdown.                                          |Konfigurasi global di web app.                                |
|websocket  |Satu instance per WebSocket connection (hanya di WebSocket app).    |1 per connection.            |Saat connection open.                                    |Saat connection close.                                      |Real-time chat atau streaming data.                           |


## Singleton Scope

Secara default, spring akan menggunakan scope singleton, yang berarti hanya ada satu instance dari bean per IoC container dan instance yang sama akan dibagi kepada setiap request. Ayo kita coba  buktikan dengan unit test.

Kita pake kasus notifier di atas, coba ambil 2 kali dan hasilnya akan sama
```java
@Test
void testSingleton() {
    ConfigurableApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);

    Notifier notifier1 = context.getBean("notifier", Notifier.class);	
    Notifier notifier2 = context.getBean("notifier", Notifier.class);

    Assertions.assertEquals(notifier1, notifier2);
    Assertions.assertTrue(notifier1 == notifier2);

    context.close();
}
```

## Prototype Scope
Jika kita mendeklarasikan scope dengan prototype maka IoC container akan membuat instance baru setiap kali ada request atau bean itu dipanggil. Untuk mendeklarasikan prototype scope bisa dengan annotation @Scope("prototype") di class-nya atau di @Bean method-nya

```java
@Configuration
public class AppConfig {
    @Bean
    @Scope("prototype")
    Notifier notifier() {
        return new EmailNotifier();
    }
}
```

Kita coba lagi dengan unit test yang sama
```java
@Test
void testNotSingleton() {
    ConfigurableApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);

    Notifier notifier1 = context.getBean("notifier", Notifier.class);	
    Notifier notifier2 = context.getBean("notifier", Notifier.class);

    Assertions.assertEquals(notifier1, notifier2);
    Assertions.assertTrue(notifier1 == notifier2);

    context.close();
}
```

maka hasil unit test-nya akan gagal seperti ini
```
[ERROR] Failures: 
[ERROR]   DemoApplicationTests.testNotSingleton:22 expected: <com.example.demo.EmailNotifier@467f77a5> but was: <com.example.demo.EmailNotifier@1bb9aa43>
```

## Lazy vs Eager 
Selain bisa mengatur scope, kita juga bisa mengatur bean mau di-instansiasi secara lazy atau eager. Secara default, spring meng-instansiasi semua bean secara eager artinya semua bean langsung di-instansiasi dan di-inject ketika ApplicationContext dibuat. Sedangkan Lazy, sesuai namanya, pembuatan bean hanya akan dilakukan jika bean akan diakses, entah itu oleh bean lain atau oleh request dari aplikasi. Untuk mengatur akan sebuah bean lazy cukup dengan annotation @Lazy di class atau @Bean method nya.

```java
@Configuration
public class AppConfig {
    @Bean
    @Lazy
    Notifier notifier() {
        return new EmailNotifier();
    }
}
```

## Component Scan dan Autowiring
Seperti yang sudah di-mention di atas, ada cara yang lebih enak untuk melakukan dependency injection yaitu dengan ComponentScan dan Autowiring. Kita tidak perlu lagi mendaftarkan bean lewat method dengan @Bean, cukup pakai annotation @Component pada setiap class yang akan jadi bean-nya.

```java
@Component
public class EmailNotifier implements Notifier {
    @Override
    public void notify(String message) {
        System.out.println("sending to email " + message);
    }
}

@Component
public class SmsNotifier implements Notifier {
    @Override
    public void notify(String message) {
        System.out.println("sending to sms " + message);
    }
}
```

untuk meng-inject dependensi-nya dengan annotation @AutoWired seperti ini
```java
@Component
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

dengan kode di atas, nanti Notifier akan di-inject secara otomatis oleh si Spring. Agar spring tahu component-component yang ada di aplikasi tambahkan @ComponentScan di class configuration
```java
@Configuration
@ComponentScan(basePackages = "com.example.demo")
public class AppConfig {
}
```

dengan kode di atas, nanti Spring akan melakukan scanning ke seluruh basePackages yang kita isi, disini basePackages-nya com.example.demo, artinya spring akan men-scan mana saja class yang memiliki @Component di dalam package tersebut dan menjadikannya bean tanpa perlu mendaftarkan dengan @Bean method seperti sebelumnya.

## Error NoUniqueBeanDefinitionException
Kalo kode kita yang di atas dijalankan, masih ada error yaitu NoUniqueBeanDefinitionException, kita coba ambil bean dengan cara yang sama seperti sebelumnya
```java
public class MainApplication {
    public static void main(String[] args) {
        ConfigurableApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
        
        NotificationService notificationService = context.getBean("notificationService", NotificationService.class);

        notificationService.send("long message");

        context.close();
    }
}
```

akan muncul error seperti ini
```
Exception in thread "main" org.springframework.beans.factory.UnsatisfiedDependencyException: Error creating bean with name 'notificationService' defined in file [/home/ikhlashmulya/Documents/Development/JAVA/demo/target/classes/com/example/demo/NotificationService.class]: Unsatisfied dependency expressed through constructor parameter 0: No qualifying bean of type 'com.example.demo.Notifier' available: expected single matching bean but found 2: emailNotifier,smsNotifier
...
Caused by: org.springframework.beans.factory.NoUniqueBeanDefinitionException: No qualifying bean of type 'com.example.demo.Notifier' available: expected single matching bean but found 2: emailNotifier,smsNotifier
```

error ini muncul karena Spring bingung, Notifier punya dua implementasi SmsNotifier dan EmailNotifier, dia bingung yang mana yang harus dipake jadi dia throw error seperti itu.

Ada beberapa cara untuk mengatasi ini

1. Menggunakan @Primary

```java
@Component
@Primary
public class EmailNotifier implements Notifier {
    @Override
    public void notify(String message) {
        System.out.println("sending to email" + message);
    }
}

@Component
public class SmsNotifier implements Notifier {
    @Override
    public void notify(String message) {
        System.out.println("sending to sms " + message);
    }
}
```

dengan menandai primary di EmailNotifier, spring akan menggunakan bean EmailNotifier sebagai implementasi utama dari Notifier.

2. Menggunakan @Qualifier

```java
@Component
public class NotificationService {
    private final Notifier notifier;

    @Autowired
    public NotificationService(@Qualifier("smsNotifier") Notifier notifier) {
        this.notifier = notifier;
    }

    public void send(String message) {
        notifier.notify(message);
    }
}
```
dengan menggunakan Qualifier kita sendiri yang akan menentukan implementasi yang mana yang akan dipakai. Contohnya di atas kita pake SmsNotifier

3. Nama bean yang explisit

Kita juga bisa secara explisit menamai bean dengan @Component("namaBean")
```java
@Component("smsBean")
public class SmsNotifier implements Notifier {
    @Override
    public void notify(String message) {
        System.out.println("sending to SMS " + message);
    }
}

@Component("emailBean")
public class EmailNotifier implements Notifier {
    @Override
    public void notify(String message) {
        System.out.println("sending to email" + message);
    }
}

@Component
public class NotificationService {
    private final Notifier notifier;

    @Autowired
    public NotificationService(@Qualifier("smsBean") Notifier notifier) {
        // menggunakan smsBean (SmsNotifier) 
        this.notifier = notifier;
    }

    public void send(String message) {
        notifier.notify(message);
    }
}
```

udah deh, kalo kita jalankan kode di atas tidak akan error sama sekali.

## Component lainnya

Oh iya, tidak hanya @Component saja, ada beberapa component lain seperti 
|Annotation     |Arti                                                |Layer        |
|---------------|----------------------------------------------------|-------------|
|@Component     |Generic bean                                        |Semua        |
|@Service       |Business logic                                      |Service layer|
|@Repository    |DAO / Database access (otomatis translate exception)|Persistence  |
|@Controller    |MVC Controller                                      |Web layer    |
|@RestController|@Controller + @ResponseBody                         |REST API     |

Semua ini akan dianggap component jadi akan masuk ke dalam @ComponentScan

## Cara kerja SpringBootApplication

```java
@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

}
```

Kalo udah paham dengan component scan, melihat kode di atas harusnya jadi masuk akal, karena sebenarnya @SpringBootApplication itu di dalamnya sudah ada @Configuration dan @ComponentScan-nya. Jadi, bisa dibilang class DemoApplication sama dengan AppConfig yang sudah kita buat sebelumnya dan `SpringApplication.run(DemoApplication.class, args);` itu sama dengan `new AnnotationConfigApplicationContext(AppConfig.class);`

Semua component yang ada di dalam projek akan masuk ke dalam kontrol SpringApplication, kita bisa juga mengambil component nya sama seperti sebelumnya

```java
@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(DemoApplication.class, args);
		
		NotificationService notificationService = context.getBean(NotificationService.class);

		notificationService.send("long message");

		context.close();
	}

}
```

## Penutup
IoC merupakan konsep inti untuk memahami cara kerja framework Spring. Dengan menggunakan IoC Container akan memudahkan kita dalam mengelola objek, kita tidak perlu melakukan Dependency Injection manual biar container sendiri yang atur.