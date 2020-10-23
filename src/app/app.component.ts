import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {
    var firebaseConfig = {
      apiKey: "AIzaSyA1_t_2dQihSZ3Td34hgYcSj58zniRIbDM",
      authDomain: "mybiblioteca-54640.firebaseapp.com",
      databaseURL: "https://mybiblioteca-54640.firebaseio.com",
      projectId: "mybiblioteca-54640",
      storageBucket: "mybiblioteca-54640.appspot.com",
      messagingSenderId: "283627340901",
      appId: "1:283627340901:web:ae7d2f01abf024063cf28c",
      measurementId: "G-LS4GRYDE0B"
    };
    // Initialize Firebase aqui estan ligadas angularApp y firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
  
  }
  
}
