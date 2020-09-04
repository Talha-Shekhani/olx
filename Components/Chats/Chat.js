import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView } from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat } from 'react-native-gifted-chat'
import { connect } from 'react-redux'

// const Drawer = createDrawerNavigator();

class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      msg: '',
      msgs: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ]
    }
  }
  handleSend(msg = []) {
    this.setState({ msgs: GiftedChat.append(this.state.msgs, msg) });
  }

  render() {
    console.log(this.state.msgs)
    const { userId } = this.props.route.params
    return (
      <GiftedChat
        text={this.state.msg}
        onInputTextChanged={(msg) => this.setState({ msg: msg })}
        messages={this.state.msgs}
        onSend={msg => this.handleSend(msg)}
        renderMessage={() => {
          <Text>{this.state.msgs}</Text>
        }}
        placeholder='Typa a message...'
        // messageIdGenerator={}
        user={{
          _id: userId,
          name: 'any'
        }} />
    )
  }
}

const styles = StyleSheet.create({

})

export default connect()(Chat)