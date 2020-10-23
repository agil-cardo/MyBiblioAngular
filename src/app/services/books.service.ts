import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Book } from '../models/book.model';


import Datasnapshot = firebase.database.DataSnapshot;
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  // le patern avec un array local avec un Objet de type book
  books: Book[] = [];
  booksSubject = new Subject<Book[]>();

  constructor() { 
    this.getBooks();
  }

  emitBooks() {
    this.booksSubject.next(this.books);
    // este metodo tomara el contenido del books y lo emitira con booksSubject
  }

  saveBooks() {
    firebase.database().ref('/books').set(this.books);

    // set funciona como "put" en Http va a remplazar lo que existe
  }

  getBooks() {
    firebase.database().ref('/books')
      .on('value', (data: Datasnapshot) => {
        this.books = data.val() ? data.val() : [];
        this.emitBooks();
      });

    // .on es un metodo que permite reaccionar a las modificaciones de BDD
    // y aqui se observa el evento "value" que return el Obj. data de type snap shot
    //qui contiene la propiedad "val" la valor de datos del servidor
    // con el operador ternaire "?" por si acaso books esta vacio 
    // y despues se emite el subjet  COMPORTEMEN REAL TIME por si hay vairos usuarios
  }

  getSingleBook(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/books/' + id).once('value').then(
          (data: Datasnapshot) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }
  // que se resuelve con la 'val' valor que viene de la BDD
  // este se recupera el dato una sola vez

  createNewBook(newBook: Book) {
    this.books.push(newBook);
    this.saveBooks();
    this.emitBooks();
  }

  //que recibe un Objeto de tipo Book en Argumento
  // y que despues agrega el nuevo libro al array de Booksss

  removeBook(book: Book) {

    if(book.photo) {
      const storageRef = firebase.storage().refFromURL(book.photo);
      storageRef.delete().then(
        () => {
          console.log('Foto eliminada!!');          
        },
        (error) => {
          console.log('no se pudo borrar papito:' + error);          
        }
      );
    }
    const bookIndexToRemove = this.books.findIndex(
      (bookEl) => {
        if (bookEl === book) {
          return true;
        }
      }
    );
    this.books.splice(bookIndexToRemove, 1);
    this.saveBooks();
    this.emitBooks();
  }

  //splice retira el book al id  
  // saveBooks suprime igualmente del servidor pues remplaza por 
  // l'array local entonces si este se cambie se acualiza en el servido
  // continuo con books-list.componet que permitira afficher, del  y todo 
  // lo que se ha escrito aqui para cada libro min 42.55

  uploadFile(file: File) {

    // muy importante revisar 1:00 del video
    return new Promise(
      (resolve, reject) => {
        const almosUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
        .child('images/' + almosUniqueFileName +file.name)
        .put(file);
      upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement...');            
          },
          (error) => {
            console.log('Erreur de chargement:' + error);
            reject();            
          },
          () => {
            resolve(upload.snapshot.ref.getDownloadURL());
          } 
          // el argumento getDownloadURL para remplazar downloadRUL que esta desvalorizada
        );  
      }
    );
  }
}

