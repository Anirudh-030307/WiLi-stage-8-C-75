import React from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import db from '../config';

export default class Searchscreen extends React.Component {
  constructor() {
    super();
    this.state = {
      allTransactions: [],
      lastVisibleTransaction: null
    }
  }
  async componentDidMount() {
    var transactions = await db.collection('Transactions').get()
    transactions.docs.map((doc) => {
      this.setState({
        allTransactions: [...this.state.allTransactions, doc.data()]
      })
    })
  }
  fetchmoreTransactions() {
    db.collection('Transactions').startAfter(this.state.lastVisibleTransaction).limit(10).get().docs.map((doc) => {
      this.setState({
        allTransactions: [...this.state.allTransactions, doc.data()],
        lastVisibleTransaction: doc
      })
    })
  }

  render() {
    return (
      <ScrollView>
        <View style={{ margin: 50 }}>
          <FlatList
            data={this.state.allTransactions}
            renderItem={({ item }) => (
              <View style={{ borderBottomWidth: 2, }}>
                <Text>{"Book Name" + item.BookID}</Text>
                <Text>{"Student Name" + item.StudentID}</Text>
                <Text>{"Transaction Type" + item.TransactionType}</Text>
              </View>
            )}
            keyExtractor={(item, index) => { index.toString() }}
            onEndReached={this.fetchmoreTransactions}
            onEndReachedThreshold={0.7}
          />
          {/* {this.state.allTransactions.map((doc) => {
            return (
              <View style={{ borderBottomWidth: 2, }}>
                <Text>{"Book Name" + doc.BookID}</Text>
                <Text>{"Student Name" + doc.StudentID}</Text>
                <Text>{"Transaction Type" + doc.TransactionType}</Text>
                <Text>{"date" + doc.date.toDate()}</Text>
              </View>
            )
          })} */}
        </View>
      </ScrollView>
    );
  }
}