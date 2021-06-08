import React from 'react';
import { View, TouchableOpacity, TextInput, Text } from 'react-native';
import firebase from 'firebase';

export default class Welcome extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
        }
    }
    login = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(()=>{this.props.navigation.navigate('TabNavigator')}).catch((error)=>{alert(error.message)})
    }

    render() {
        return (
            <View>
                <TextInput placeholder="EMAIL" onChangeText={(text) => {
                    this.setState({
                        email: text
                    })
                }} />
                <TextInput placeholder="PASSWORD" onChangeText={(text) => {
                    this.setState({
                        password: text
                    })
                }} />
                <TouchableOpacity onPress={this.login}><Text>LOGIN</Text></TouchableOpacity>
            </View>
        );
    }
}