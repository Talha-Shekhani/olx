import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage'
import { GiftedChat } from 'react-native-gifted-chat'
import { connect } from 'react-redux'
import { postChatMsg, fetchChats } from '../../redux/Actions'
import { chats } from '../../redux/chat';

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
      ]
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
  }

  handleSend(msg = []) {
    console.log(this.state.userId)
    console.log(msg[0].user._id)
    msg[0].from_user_id = this.state.userId;
    // let dat = new Date().getTime()
    // console.log(dat)
    // msg[0].createdAt = dat
    this.props.postChatMsg(msg)
    // this.props.fetchChats(this.state.userId, this.props.route.params.userId)
    this.forceUpdate()
    // this.setState({ msgs: GiftedChat.append(this.state.msgs, msg) });
    // console.log(this.props)
  }

  render() {
    const { userId } = this.props.route.params
    return (
      <GiftedChat
        // renderUsernameOnMessage={true}
        // onLongPress={(msg) => console.log(msg.text)}
        messagesContainerStyle={styles.container}
        text={this.state.msg}
        onInputTextChanged={(msg) => this.setState({ msg: msg })}
        messages={this.state.msgs}
        onSend={msg => this.handleSend(msg)}
        isTyping={true}
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