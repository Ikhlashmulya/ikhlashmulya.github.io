---
title: Membangun REST API dengan Clean Architecture di Golang
type: page
description: Click on me to see the content.
topic: programming
date: 2023-07-29T11:30:03+00:00
---

## Clean Architecture
Dalam dunia pengembangan perangkat lunak, struktur proyek yang baik dan pemisahan kelas menjadi lapisan yang terdefinisi dengan jelas menjadi kunci untuk menghasilkan kode yang mudah dijaga, diuji, dan dikembangkan lebih lanjut. Clean Architecture, sebuah pendekatan desain perangkat lunak yang memisahkan antara logika bisnis, framework dan/atau driver.

Beberapa prinsip clean architecture menurut Robert C. Martin (Uncle Bob) :

- Independen dari framework. Architecture tidak bergantung pada framework tertentu, hal ini memungkinkan Anda untuk menggunakan framework sebagai alat, tanpa harus terjebak dalam batasan-batasan yang diberlakukan oleh framework tersebut.
- Testable. Aturan bisnis dapat di-*test* tanpa UI (User Interface), Database, Web Server atau elemen-elemen eksternal lainnya. 
- Independen dari UI. Antarmuka pengguna (User Interface) dapat diubah dengan mudah tanpa harus mengubah seluruh sistem. Sebagai contoh, Anda dapat mengganti antarmuka Web dengan antarmuka berbasis console tanpa harus mengubah logika bisnisnya.
- Independen dari Database. Anda dapat mengganti database dari Oracle atau SQL Server, ke Mongo, BigTable, CouchDB, atau lainnya. Karena logika bisnis tidak terikat dengan database.
- Independen dari segala elemen-elemen eksternal. Bahkan logika bisnis sama sekali tidak mengetahui apa pun tentang dunia luar. Karena logika bisnis berdiri sendiri dan tidak bergantung pada layanan eksternal tertentu untuk beroperasi.

![clean architecture](https://blog.cleancoder.com/uncle-bob/images/2012-08-13-the-clean-architecture/CleanArchitecture.jpg)

*baca lebih lanjut [di sini](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)*

## Pre-Requisite
sebelum memahami pembahasan pastikan sudah menguasai :
- Golang Dasar
- Golang Context
- Golang Database
- Golang Web
- Golang Json

## Project Layer
Secara garis besar, arsitektur yang akan kita bangun mempunyai 4 domain layer (tidak harus seperti ini) : 
- Entity
- Repository
- Usecase
- Delivery

![Diagram Flow](/images/diagram-flow.png#center)

### Entity
Layer Entity merupakan bagian dari arsitektur yang bertanggung jawab untuk mendefinisikan entitas-entitas utama dalam sistem. Entitas ini bisa berupa objek atau struktur data yang merepresentasikan objek dunia nyata dalam domain aplikasi atau bisa juga untuk merepresentasikan table di database. Sebagai contoh, entitas dari pengguna, produk, transaksi, contact dll. 

### Repository
Layer Repository adalah lapisan yang bertanggung jawab untuk mengelola akses ke sumber data seperti database. Tugasnya untuk menyediakan abstraksi dari operasi data, seperti membaca, menulis, memperbarui, dan menghapus entitas-entitas yang ada dalam sistem.

### Usecase
Layer Usecase adalah lapisan yang berisi logika bisnis utama dari aplikasi. Di sini, berbagai aturan bisnis dan skenario digabungkan. Layer ini berfungsi sebagai jembatan antara lapisan Delivery (antarmuka pengguna) dan Repository untuk memproses permintaan dari pengguna dan menerapkan aturan bisnis aplikasi.

### Delivery
Layer Delivery adalah lapisan terluar dari arsitektur yang berhubungan langsung dengan antarmuka pengguna atau elemen-elemen eksternal lainnya. Lapisan ini bertanggung jawab untuk menangani permintaan dari pengguna dan memberikan respon yang sesuai. Dalam konteks ini bisa berarti menangani permintaan dan memberikan respon JSON.


Dalam diagram di atas, arus data berjalan dari lapisan "Delivery" (antarmuka pengguna) ke lapisan "Usecase" (logika bisnis) ke lapisan "Repository" (akses data) dan akhirnya ke lapisan "Entity" (definisi entitas). Setiap lapisan memiliki tanggung jawabnya sendiri dan bekerja terpisah satu sama lain. Hal ini mencerminkan pemisahan yang jelas antara logika bisnis dan penyimpanan dalam clean architecture.


## Implementasi
Implementasi dari layer layer di atas, menghasilkan struktur folder berikut : 
```text
.
├── app
├── delivery
│   └── http
├── exception
├── entity
├── model
├── repository
└── usecase
```
Struktur folder ini masih bisa berkembang seiring dengan bertambahnya kebutuhan sistem. Sekarang mari kita bahas satu per satu

- `app`: Folder ini berfungsi sebagai titik masuk (entry point) dari aplikasi. Di sini kita dapat menyimpan file-file yang berhubungan dengan framework atau driver kebutuhan aplikasi sebagai contoh kita bisa menyimpan konfigurasi koneksi database, inisialisasi framework atau setup awal aplikasi
- `delivery`: Folder ini berisi implementasi dari lapisan "Delivery" dalam clean architecture (atau bisa disebut presenters dan controller). Lapisan ini berhubungan langsung dengan antarmuka pengguna atau elemen eksternal lainnya. Dalam kasus ini, folder "delivery" memiliki subfolder "http" yang berisi implementasi pengiriman melalui protokol HTTP.
- `exception`: Folder ini berisi definisi atau implementasi dari exception atau error handling dalam aplikasi. Kita bisa menempatkan seluruh error atau exception yang terjadi di setiap lapisan.
- `entity`: Folder ini berisi definisi entitas-entitas utama dalam sistem. Entitas ini mencerminkan layer "Entity" dalam clean architecture dan berisi atribut dan perilaku dari objek dunia nyata.
- `model`: Folder ini berisi model-data yang digunakan untuk pertukaran data antara layer-layer dalam arsitektur atau orang-orang banyak menyebutnya dengan DTO (Data Transfer Object).
- `repository`: Folder ini berisi implementasi dari layer "Repository" dalam clean architecture yang bertanggung jawab untuk mengelola akses ke sumber data eksternal, seperti database.
- `usecase`: Folder ini berisi implementasi layer "Usecase" dalam clean architecture yang merupakan logika bisnis utama (business logic) sebuah aplikasi.


Setelah menentukan struktur folder yang sesuai, mari kita sekarang beralih ke implementasi kode untuk setiap layer dalam clean architecture.

### repository & entity
Kita mulai dari layer paling dalam terlebih dahulu yaitu repository, untuk membuat repository kita define terlebih dahulu entitas yang akan digunakan di dalam program, di sini saya akan mencontohkan studi kasus sederhana yaitu todo list, berikut entity-nya :
```go
package entity

type Todo struct {
	Id   string
	Name string
}
```
dari entity tersebut kita buat repository-nya untuk menyimpan ke database, berikut kode untuk repository : 

`repository/todo_repository.go`
```go
type TodoRepository interface {
	Create(ctx context.Context, todo entity.Todo)
	GetAll(ctx context.Context) []entity.Todo
	GetById(ctx context.Context, todoId string) (response entity.Todo, err error)
	Delete(ctx context.Context, todoId string)
}

```

`repository/todo_repository_impl.go`
```go
type TodoRepositoryImpl struct {
	DB *sql.DB
}

// constructor
func NewTodoRepository(db *sql.DB) *TodoRepositoryImpl {
	return &TodoRepositoryImpl{
		DB: db,
	}
}

func (todorepositoryimpl *TodoRepositoryImpl) Create(ctx context.Context, todo entity.Todo) {
	//transaction
	tx, err := todorepositoryimpl.DB.Begin()
	exception.PanicIfError(err)
	defer commitOrRollback(tx)

	SQL := "INSERT INTO todo (id, name) VALUES (?, ?)"

	//execution
	_, err = tx.ExecContext(ctx, SQL, todo.Id, todo.Name)
	exception.PanicIfError(err)
}

func (todorepositoryimpl *TodoRepositoryImpl) GetAll(ctx context.Context) []entity.Todo {
	SQL := "SELECT id, name FROM todo"

	//query
	rows, err := todorepositoryimpl.DB.QueryContext(ctx, SQL)
	exception.PanicIfError(err)
	defer rows.Close()

	todos := []entity.Todo{}

	//iterate data
	for rows.Next() {
		todo := entity.Todo{}

		errScan := rows.Scan(&todo.Id, &todo.Name)
		exception.PanicIfError(errScan)

		todos = append(todos, todo)
	}

	return todos
}

func (todorepositoryimpl *TodoRepositoryImpl) Delete(ctx context.Context, todoId string) {
	//transaction
	tx, err := todorepositoryimpl.DB.Begin()
	exception.PanicIfError(err)
	defer commitOrRollback(tx)

	SQL := "DELETE FROM todo WHERE id = ?"

	//execution
	_, err = tx.ExecContext(ctx, SQL, todoId)
	exception.PanicIfError(err)
}

func (todorepositoryimpl *TodoRepositoryImpl) GetById(ctx context.Context, todoId string) (response entity.Todo, err error) {
	SQL := "SELECT id, name FROM todo WHERE id = ?"

	//query
	row, err := todorepositoryimpl.DB.QueryContext(ctx, SQL, todoId)
	exception.PanicIfError(err)
	defer row.Close()

	//check apakah data ada atau tidak
	if row.Next() {
		errScan := row.Scan(&response.Id, &response.Name)
		exception.PanicIfError(errScan)

		return response, nil
	} else {
		// jika tidak ada kirimkan error sql.ErrNoRows
		return entity.Todo{}, sql.ErrNoRows
	}
}

//handling untuk commit atau rollback
//(akan rollback jika terjadi error)
func commitOrRollback(tx *sql.Tx) {
	err := recover()
	switch err {
	case nil:
		errCommit := tx.Commit()
		exception.PanicIfError(errCommit)
	default:
		errRollback := tx.Rollback()
		exception.PanicIfError(errRollback)
		panic(err)
	}
}

```
*sebelumnya buat terlebih dahulu untuk error handling nya :*

`exception/panic_if_error.go`
```go
package exception

func PanicIfError(err error) {
	if err != nil {
		panic(err)
	}
}

```
Pada kode di atas, kita buat terlebih dulu kontraknya menggunakan interface, kenapa menggunakan interface? agar pada layer usecase hanya berinteraksi dengan interface-nya, sehingga jika ada perubahan seperti mengubah database-nya, layer usecase tidak ada yang berubah sama sekali, misal kita ingin mengubah database dari mysql ke mongodb, kita cukup mengubah implementasinya saja yang ada di `repository/todo_repository_impl.go` layer-layer lain tidak perlu disentuh sama sekali.

Setelah mendefinisikan kontrak, kita implementasikan fungsi-fungsi tersebut dalam "TodoRepositoryImpl" yang menggunakan basis data SQL untuk berinteraksi dengan tabel "todo". 

### Usecase Layer
Usecase layer adalah tempat logika bisnis utama aplikasi, layer ini ketergantungan dengan layer repository, layer ini juga sering disebut jembatan antara delivery/presenter dengan repository.

Seperti repository layer di atas, di usecase juga sama kita akan membuat interfacenya terlebih dahulu kemudian diimplementasikan.

untuk membuat usecase layer sebaiknya kita membuat permodelan data terlebih dahulu, pemodelan ini meliputi representasi data request dari user dan responsenya.

permodelan data disimpan di dalam folder `model`, berikut isinya :

`model/todo_model.go`
```go
type CreateTodoRequest struct {
	Name string `json:"name,omitempty"`
}

type TodoResponse struct {
	Id   string `json:"id,omitempty"`
	Name string `json:"name,omitempty"`
}
```

struct di atas adalah pemodelan atau representasi data request dari user dan response ke user. Kemudian, kita buat usecase-nya : 

`usecase/todo_usecase.go`
```go
type TodoUsecase interface {
	Create(ctx context.Context, request model.CreateTodoRequest) (response model.TodoResponse)
	Delete(ctx context.Context, todoId string)
	GetById(ctx context.Context, todoId string) (response model.TodoResponse)
	GetAll(ctx context.Context) (responses []model.TodoResponse)
}
```

`usecase/todo_usecase_impl.go`
```go
type TodoUsecaseImpl struct {
	TodoRepository repository.TodoRepository
}

//constructor
func NewTodoUsecase(todoRepository repository.TodoRepository) *TodoUsecaseImpl {
	return &TodoUsecaseImpl{TodoRepository: todoRepository}
}

//logika bisnis untuk membuat todo
func (todousecaseimpl *TodoUsecaseImpl) Create(ctx context.Context, request model.CreateTodoRequest) (response model.TodoResponse) {
	//buat terlebih dahulu datanya
	todo := entity.Todo{
		Id:   uuid.NewString(),
		Name: request.Name,
	}

	//setelah dibuat kirimkan ke repository
	todousecaseimpl.TodoRepository.Create(ctx, todo)

	//kembalikan data yang sudah dibuat
	return toTodoResponse(&todo)
}

// logika bisnis untuk menghapus todo
func (todousecaseimpl *TodoUsecaseImpl) Delete(ctx context.Context, todoId string) {
	//get by id terlebih dahulu untuk mengecek data apakah ada atau tidak
	todo, err := todousecaseimpl.TodoRepository.GetById(ctx, todoId)
	if err != nil {
		//jika tidak ada panic-kan program dengan mengirim struct ErrorNotFound
		panic(exception.NewErrorNotFound(err.Error()))
	}

	//jika data ada kirimkan id-nya ke repository untuk dihapus
	todousecaseimpl.TodoRepository.Delete(ctx, todo.Id)
}

// logika bisnis untuk mengambil todo berdasarkan id
func (todousecaseimpl *TodoUsecaseImpl) GetById(ctx context.Context, todoId string) (response model.TodoResponse) {
	todo, err := todousecaseimpl.TodoRepository.GetById(ctx, todoId)
	if err != nil {
		panic(exception.NewErrorNotFound(err.Error()))
	}

	return toTodoResponse(&todo)
}

//logika bisnis untuk mengambil semua todo
func (todousecaseimpl *TodoUsecaseImpl) GetAll(ctx context.Context) (responses []model.TodoResponse) {
	//ambil semua todo
	todos := todousecaseimpl.TodoRepository.GetAll(ctx)

	//konversi semua ke todo response
	for _, todo := range todos {
		responses = append(responses, toTodoResponse(&todo))
	}

	return responses
}
```
untuk function `toTodoResponse()` di atas kita buat terlebih dahulu untuk mengkonversi dari `entity.Note` ke `model.TodoResponse` function ini dapat disimpan di file yang sama atau membuat file baru, misal saja kita buat file `mapper.go` untuk menyimpan functionnya, berikut isinya :

`usecase/mapper.go`
```go
func toTodoResponse(todo *entity.Todo) model.TodoResponse {
	return model.TodoResponse{
		Id:   todo.Id,
		Name: todo.Name,
	}
}
```
untuk `ErrorNotFound` di atas adalah struct untuk menghandle error jika data tidak ada di database, untuk menghandle-nya bisa berupa struct yang mengikuti kontrak interface error structnya dapat disimpan di folder `exception` :

`exception/error_not_found.go`
```go
type ErrorNotFound struct {
	Message string
}

func NewErrorNotFound(message string) *ErrorNotFound {
	return &ErrorNotFound{
		Message: message,
	}
}

//implementasi kontrak interface error
func (errornotfound *ErrorNotFound) Error() string {
	return errornotfound.Message
}
```

### Delivery Layer
Delivery layer adalah layer terluar yang menjadi titik masuk utama bagi permintaan user dan tempat di mana respons diberikan kembali ke user. 

Layer delivery tidak seharusnya berisi logika bisnis yang kompleks. Tujuan utama dari layer ini adalah mengarahkan permintaan user ke layer Usecase yang sesuai dan mengembalikan respons dari Usecase ke user.

di dalam folder delivery kita buat folder http yang berarti berisi kode-kode yang berkaitan dengan antarmuka pengguna melalui protokol HTTP (atau bisa diubah dengan yang lain misalnya grpc)

dalam layer delivery terdapat beberapa komponen seperti handler yaitu komponen yang mengambil permintaan HTTP dari pengguna, memprosesnya, dan menghasilkan respons HTTP atau middleware yaitu komponen yang dapat menambahkan fungsi tambahan sebelum atau setelah permintaan mencapai handler. 

Berikut contohnya :

`delivery/http/todo_handler`
```go
type TodoHandler struct {
	TodoUsecase usecase.TodoUsecase
}

//constructor
func NewTodoHandler(todoUsecase usecase.TodoUsecase) *TodoHandler {
	return &TodoHandler{TodoUsecase: todoUsecase}
}

//handler create
func (todoHandler *TodoHandler) Create(writer http.ResponseWriter, request *http.Request, _ httprouter.Params) {
	//mengambil request body
	var createTodoRequest model.CreateTodoRequest
	err := json.NewDecoder(request.Body).Decode(&createTodoRequest)
	exception.PanicIfError(err)
	defer request.Body.Close()

	//mengirimkan request body ke usecase dan menerima response
	response := todoHandler.TodoUsecase.Create(request.Context(), createTodoRequest)

	//mengirim response ke user (functionnya ada di paling bawah)
	toResponseJSON(writer, http.StatusCreated, model.WebResponse{
		Code:   http.StatusCreated,
		Status: "CREATED",
		Data:   response,
	})

}

func (todoHandler *TodoHandler) Delete(writer http.ResponseWriter, request *http.Request, params httprouter.Params) {
	todoId := params.ByName("id")

	todoHandler.TodoUsecase.Delete(request.Context(), todoId)

	toResponseJSON(writer, http.StatusOK, model.WebResponse{
		Code:   http.StatusOK,
		Status: "OK",
	})

}

func (todoHandler *TodoHandler) GetAll(writer http.ResponseWriter, request *http.Request, _ httprouter.Params) {
	response := todoHandler.TodoUsecase.GetAll(request.Context())

	toResponseJSON(writer, http.StatusOK, model.WebResponse{
		Code:   http.StatusOK,
		Status: "OK",
		Data:   response,
	})

}

func toResponseJSON(writer http.ResponseWriter, code int, data any) {
	writer.Header().Add("content-type", "application/json")
	writer.WriteHeader(code)

	err := json.NewEncoder(writer).Encode(data)
	exception.PanicIfError(err)
}
```

di dalam handler cukup simple sebenarnya karena cukup menerima request body dari user kemudian mengirimkan response-nya dari usecase.

### App layer

jika kita melihat gambaran clean architecture di atas ada satu layer lagi di paling luar yaitu layer untuk framework atau driver. Nah di dalam folder `app` kita kali ini, kita bisa menyimpan driver untuk database di sana dan juga framework untuk aplikasi kita siap kan di sana. 

Misalnya saja untuk aplikasi kita kali ini hanya membutuhkan database drivernya dan juga router, kita bisa simpan konfigurasinya disana. 

`app/db.go`
```go
func NewDB() *sql.DB {
	db, err := sql.Open("mysql", "root:@tcp(localhost:3306)/golang_restful_api")
	exception.PanicIfError(err)

	db.SetMaxIdleConns(10)
	db.SetMaxOpenConns(100)
	db.SetConnMaxIdleTime(5 * time.Minute)
	db.SetConnMaxLifetime(time.Hour)

	return db
}
```

di dalam db.go ini kita bisa menyimpan connection poolnya di sana, yang nantinya bisa kita inject ke dalam repository.

`app/router.go`
```go
func NewRouter(todoHandler *handler.TodoHandler) http.Handler {
	router := httprouter.New()

	router.GET("/api/todos", todoHandler.GetAll)
	router.DELETE("/api/todos/:id", todoHandler.Delete)
	router.POST("/api/todos", todoHandler.Create)

	//configuration panic handler
	router.PanicHandler = exception.PanicHandler

	return router
}
```

di dalam router.go kita bisa atur-atur endpoint-endpoint yang ada di dalam aplikasi.

### Error Handling
di dalam router terdapat panic handler, panic handler adalah function yang akan dieksekusi saat terjadi panic/error, untuk panic handling kita bisa buat di `exception`

`exception/panic_handler.go`
```go
func PanicHandler(writer http.ResponseWriter, request *http.Request, err interface{}) {

	if exception, ok := err.(*ErrorNotFound); ok {
		writer.Header().Add("content-type", "application/json")
		writer.WriteHeader(http.StatusNotFound)
		json.NewEncoder(writer).Encode(model.WebResponse{
			Code:   http.StatusNotFound,
			Status: "NOT_FOUND",
			Error:  exception.Error(),
		})

		return
	}

	writer.Header().Add("content-type", "application/json")
	writer.WriteHeader(http.StatusInternalServerError)
	json.NewEncoder(writer).Encode(model.WebResponse{
		Code:   http.StatusInternalServerError,
		Status: "INTERNAL_SERVER_ERROR",
		Data:   err,
	})
```

di dalam panic handler ini semua panic yang ada di dalam aplikasi akan dilempar ke function ini untuk dieksekusi.

Karena tadi kita membuat handling untuk not found atau jika data tidak ada, maka kita bisa mengecek jika errornya dapat dikonversi ke dalam struct `*ErrorNotFound` maka bisa dipastikan itu error karena data tidak ada, dan akan mengeksekusi kode di dalam if-nya setelah itu selesaikan dengan return agar baris kode di bawahnya tidak dieksekusi lagi.

di dalam functionnya cukup sederhana yaitu hanya mengembalikan response kepada user dalam bentuk JSON.

### Dependency Injection
jika sudah semua di atas saat melakukan [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection) yang dapat dilakukan di
`main.go`
```go
func main() {
	db := app.NewDB()
	todoRepository := repository.NewTodoRepository(db)
	todoUsecase := usecase.NewTodoUsecase(todoRepository)
	todoHandler := handler.NewTodoHandler(todoUsecase)
	router := app.NewRouter(todoHandler)

	server := http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	log.Println("Server running on port :8080")
	err := server.ListenAndServe()
	exception.PanicIfError(err)
}
```

## Conclusion

kita telah menggali secara mendalam tentang Clean Architecture dan bagaimana konsep ini dapat diimplementasikan dalam pengembangan REST API menggunakan bahasa pemrograman Golang. Kita telah memahami struktur dari Clean Architecture, yang terdiri dari empat lapisan seperti Entity, Repository, Usecase, dan Delivery. 

Dengan Clean Architecture, kita tidak hanya membangun kode, tetapi juga membangun fondasi yang kuat untuk pertumbuhan dan evolusi aplikasi. Clean Architecture dapat membuat pengembang untuk menghasilkan aplikasi yang mudah dimaintain dan skalabel.

## Reference
- [https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- source code [https://github.com/Ikhlashmulya/golang-restful-api](https://github.com/Ikhlashmulya/golang-restful-api)