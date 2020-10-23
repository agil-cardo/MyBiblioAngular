import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Book } from 'src/app/models/book.model';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit {

  //para cargar fotos se agregan algunas PROPIEDADES ademas de bookForm
  // fileUploaded para señalar el final du Upload
  bookForm: FormGroup;
  fileIsUpLoading = false;
  fileUrl: string;
  fileUploaded = false;


  constructor(private formBuilder: FormBuilder,
              private booksService: BooksService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
    });
  }

  onSaveBook() {
    const title = this.bookForm.get('title').value;
    const author = this.bookForm.get('author').value;
    const newBook = new Book(title, author);
    //una vez que el libro ha sido creado se verifica si
    // hay un archivo que ha cargado y (&&) que no esta vacio que se escrive como sigue !==''
    if(this.fileUrl && this.fileUrl !=='') {
      newBook.photo = this.fileUrl;
      //osea que cuando se registra el libro tambien la foto
    }
    this.booksService.createNewBook(newBook);
    this.router.navigate(['/books']);
  }

  //QUIZAS esto hubiese podido ayudar a Silvan con su fichier complejo
  onUploadFile(file: File) {
    this.fileIsUpLoading = true;
    this.booksService.uploadFile(file).then(
      (url: string) => {
        this.fileUrl = url;
        this.fileIsUpLoading = false; 
        // ya no serà verdad pues el archivo habrà terminado de Upload
        this.fileUploaded = true;
        // en este momento el archivo habrà sido cargado
      }
    )
  }
  
  detectFiles(event: any) 
  //event es la info que viene del DOM y se crea en el html
  {
    this.onUploadFile(event.target.files[0]);
  }

}
