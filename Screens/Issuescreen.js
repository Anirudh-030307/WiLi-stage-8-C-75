import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, ToastAndroid, Alert, } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import db from '../config';
import firebase from 'firebase';

export default class Issuescreen extends React.Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermissions: null,
      Scanned: false,
      ButtonState: 'normal',
      BookID: '',
      StudentID: '',
    }
  }
  GetCameraPermissions = async (x) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermissions: status === "granted",
      ButtonState: x,
      Scanned: false,
    })
  }
  HandleBarCodeScanner = async ({ type, data }) => {
    if (this.state.ButtonState === 'BookID') {
      this.setState({
        Scanned: true,
        BookID: data,
        ButtonState: 'normal',
      })
    } else if (this.state.ButtonState === 'StudentID') {
      this.setState({
        Scanned: true,
        StudentID: data,
        ButtonState: 'normal',
      })
    }

  }
  HandleTransactions = async () => {
    /* db.collection('Books').doc(this.state.BookID).get().then(
      (doc) => {
        var details = doc.data()
        if (details.BookAvailability === true) {
          this.initiateBookIssue()
        } else {
          this.initiateBookReturn()
        }
      }
    )*/
    var TransactionType = await this.CheckBookAvailability()
    if (!TransactionType) {
      this.setState({
        BookID: '',
        StudentID: '',
      })
      console.log(TransactionType);
      alert("This Book does not exist")
    } else if (TransactionType == "issue") {
      var isStudentEligible = await this.CheckStudentEligibilityForBookIssue()
      if (isStudentEligible) {
        this.initiateBookIssue()
      } else {
        this.setState({
          BookID: '',
          StudentID: '',
        })
      }
    } else {
      var isStudentEligible = await this.CheckStudentEligibilityForBookReturn()
      if (isStudentEligible) {
        this.initiateBookReturn()
        alert("Book is returned to the library")
      } else {
        this.setState({
          BookID: '',
          StudentID: '',
        })
      }
    }

  }
  initiateBookIssue = () => {
    db.collection('Transactions').add({
      StudentID: this.state.StudentID,
      BookID: this.state.BookID,
      date: firebase.firestore.Timestamp.now().toDate(),
      TransactionType: 'issue',
    })
    db.collection('Books').doc(this.state.BookID).update({
      BookAvailability: false,
    })
    db.collection('Students').doc(this.state.StudentID).update({
      NumberofBooksIssued: firebase.firestore.FieldValue.increment(1)
    })
    alert("Book is issued")
    this.setState({
      BookID: '',
      StudentID: '',
    })
    //ToastAndroid.show("BOOK ISSUE SUCCESSFUL", ToastAndroid.SHORT)
  }
  initiateBookReturn = () => {
    db.collection('Transactions').add({
      StudentID: this.state.StudentID,
      BookID: this.state.BookID,
      date: firebase.firestore.Timestamp.now().toDate(),
      TransactionType: 'return',
    })
    db.collection('Books').doc(this.state.BookID).update({
      BookAvailability: true,
    })
    db.collection('Students').doc(this.state.StudentID).update({
      NumberofBooksIssued: firebase.firestore.FieldValue.increment(-1)
    })
    alert("Book is returned")
    this.setState({
      BookID: '',
      StudentID: '',
    })
    //ToastAndroid.show("BOOK RETURN SUCCESSFUL", ToastAndroid.SHORT)
  }
  CheckBookAvailability = async () => {
    const bookref = await db.collection('Books').where('BookID', '==', this.state.BookID).get()
    var TransactionType = ''
    if (bookref.docs.length == 0) {
      TransactionType = false
    } else {
      bookref.docs.map((doc) => {
        var book = doc.data()
        console.log(book);
        if (book.BookAvailability == true) {
          TransactionType = 'issue'
        } else {
          TransactionType = 'return'
        }
      })
    }
    return TransactionType
  }
  CheckStudentEligibilityForBookIssue = async () => {
    const studentref = await db.collection('Students').where('StudentID', '==', this.state.StudentID).get()
    var isStudentEligible = ""
    if (studentref.docs.length == 0) {
      isStudentEligible = false
      alert("This Student does not exist")
    } else {
      studentref.docs.map((doc) => {
        var student = doc.data()
        if (student.NumberofBooksIssued < 2) {
          isStudentEligible = true
        } else {
          isStudentEligible = false
          alert("This student has already been issued two books")
        }
      })
    }
    return isStudentEligible
  }
  CheckStudentEligibilityForBookReturn = async () => {
    const transactionsref = await db.collection('Transactions')
      .where('BookID', '==', this.state.BookID).limit(1).get()
    var isStudentEligible = ""
    transactionsref.docs.map(doc => {
      var lastBookTransaction = doc.data()
      if (lastBookTransaction.StudentID == this.state.StudentID) {
        isStudentEligible = true
      } else {
        isStudentEligible = false
        alert("This Book is not issued to this student")
      }
    })
  }

  render() {
    const hasCameraPermissions = this.state.hasCameraPermissions;
    const Scanned = this.state.Scanned;
    const ButtonState = this.state.ButtonState;
    if (ButtonState !== "normal" && hasCameraPermissions === true) {
      return (
        <BarCodeScanner onBarCodeScanned={Scanned ? undefined : this.HandleBarCodeScanner} />
      )
    } else {
      return (
        <KeyboardAvoidingView style={styles.Container} enabled>
          <Image style={styles.ImageStyle} source={require("../assets/booklogo.jpg")} />
          <View style={styles.view} >
            <TextInput style={styles.TextBox} value={this.state.BookID} onChangeText={(Text) => (this.setState({
              BookID: Text
            }))} placeholder="BookID" />
            <TouchableOpacity style={styles.ScanButton} onPress={() => this.GetCameraPermissions('BookID')}>
              <Text style={styles.text} >SCAN</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.view} >
            <TextInput style={styles.TextBox} value={this.state.StudentID} onChangeText={(Text) => (this.setState({
              StudentID: Text
            }))} placeholder="StudentID" />
            <TouchableOpacity style={styles.ScanButton} onPress={() => this.GetCameraPermissions('StudentID')}>
              <Text style={styles.text} >SCAN</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.SumbitButton} onPress={this.HandleTransactions}>
            <Text style={styles.text} >SUMBIT</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      );
    }
  }
}

const styles = StyleSheet.create({
  Container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageStyle: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  ScanButton: {
    alignSelf: 'center',
    borderWidth: 1,
    backgroundColor: 'lightgreen',
    width: 60,
    height: 50,
    borderLeftWidth: 0,
  },
  text: {
    alignSelf: 'center',
    marginTop: 10,
  },
  SumbitButton: {
    alignSelf: 'center',
    marginTop: 50,
    borderWidth: 1,
    borderRadius: 10,
    width: 90,
    height: 50,
  },
  TextBox: {
    alignSelf: 'center',
    borderWidth: 1,
    width: 200,
    height: 50,
    borderRightWidth: 0,
  },
  view: {
    flexDirection: 'row',
    padding: 20,
  },
})