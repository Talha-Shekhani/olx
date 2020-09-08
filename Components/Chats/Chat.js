import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage'
import { GiftedChat } from 'react-native-gifted-chat'
import { connect } from 'react-redux'
import { postChatMsg, fetchChats } from '../../redux/Actions'
var W3CWebSocket = require('websocket').w3cwebsocket

const client = new W3CWebSocket('wss://10.0.2.2:8000')

const mapStateToProps = state => ({
  user: state.users,
  chats: state.chats.chats
})

const mapDispatchToProps = dispatch => ({
  postChatMsg: (msg) => dispatch(postChatMsg(msg)),
  fetchChats: (from_user, to_user) => dispatch(fetchChats(from_user, to_user))
})

class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: '',
      msg: '',
      msgs: [
        // {
        //   _id: 'qwww',
        //   text: 'Hello developer',
        //   createdAt: new Date(),
        //   sent: true,
        //   recieved: true,
        //   user: {
        //     _id: 2,
        //     name: 'React Native',
        //     avatar: 'https://placeimg.com/140/140/any',
        //   },
        // },
      ],
      abc: false
    }
  }

  UNSAFE_componentWillMount() {
    const userdata = AsyncStorage.getItem('userdata')
      .then((userdata) => {
        if (userdata) {
          let userinfo = JSON.parse(userdata)
          this.setState({ userId: userinfo.userId })
          this.props.fetchChats(this.state.userId, this.props.route.params.userId)
          this.setState({ msgs: this.props.chats })
        }
      })
      .catch((err) => console.log('Cannot find user info' + err))
    console.log('object')
    // if ("WebSocket" in Platform.OS)
    //   console.log(("WebSocket is supported by your Browser!")
    console.log(client.readyState)
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    }
    client.onerror = err => {
      console.log('socketerr ', err)
    }
    // client.close()
    client.onclose = () => {
      console.log('close')
    }
  }

  handleSend(msg = []) {
    console.log(this.state.userId)
    console.log(msg[0].user._id)
    msg[0].from_user_id = this.state.userId;
    this.props.postChatMsg(msg)
  }

  render() {
    const { userId } = this.props.route.params
    // console.log('msgs', this.state.msgs)
    return (
      <GiftedChat
        // renderUsernameOnMessage={true}
        // onLongPress={(msg) => console.log(msg.text)}
        messagesContainerStyle={styles.container}
        text={this.state.msg}
        onInputTextChanged={(msg) => this.setState({ msg: msg })}
        messages={this.props.chats}
        onSend={msg => this.handleSend(msg)}
        isTyping={true}
        // renderMessageImage={() => }
        // renderMessage={() => {
        // }}
        // renderSend={() => {
        //   if (this.state.msg != '')
        //     return (<Icon name='send' color='#0084ff' style={styles.sendIcon} onPress={ msg => this.handleSend(msg) } />)
        // }}
        placeholder='Typa a message...'
        // messageIdGenerator={}
        user={{
          _id: userId
        }} />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  sendIcon: {
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 12
  }

})

export default connect(mapStateToProps, mapDispatchToProps)(Chat)