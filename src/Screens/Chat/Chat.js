import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  SendProps,
} from 'react-native-gifted-chat';
import {connect} from 'react-redux';
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  Image,
  Text,
  ImageBackground,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import * as actions from '../../Store/Actions/index';
import {View} from 'react-native';
import {themeRed} from '../../Assets/Colors/Colors';
import {io} from 'socket.io-client';
import {imageUrl} from '../../Config/Apis.json';
import {api} from '../../Config/Apis.json';
import {useIsFocused} from '@react-navigation/native';
const {width, height} = Dimensions.get('window');

function Chat({route, getMessages, messagesReducer, sendMessage, userReducer}) {
  const isFocused = useIsFocused();
  const socket = useRef();
  const [text, setText] = useState('');
  const userId = userReducer?.data?.user_id;
  const [messages, setMessages] = useState([]);
  const [randNum, setRandNum] = useState(null);
  const [arrivalMessage, setarrivalMessage] = useState(null);
  const CURRENT_CHAT = messagesReducer?.currentChat;
  const conversationId = CURRENT_CHAT?.conversationId;
  const chatPersonId = CURRENT_CHAT?.chatPerson?.user_id;
  const [saveText, setSaveText] = useState('');
  const [id, setId] = useState(null);
  const apiData = {
    sender: userId,
    receiver: CURRENT_CHAT?.chatPerson?.user_id,
  };
  const socketRef = userReducer?.socket;
  // const [socketRef, setSocketRef] = useState()

  // socketRef = io('http://webprojectmockup.com:9444');

  // useEffect(() => {
  //   socketRef.emit('addUser', userId);
  //   // socketRef.on('getusers', users => console.log(users));
  // }, [userId]);

  useEffect(() => {
    socketRef.emit('addUser', userId);

    socketRef.on('getMessage', data => {
      console.log(data, 'Text Recieved========');
      setarrivalMessage({
        _id: data?.id,
        text: data?.text,
        createdAt: new Date(),
        user: {
          _id: chatPersonId,
          name: CURRENT_CHAT?.chatPerson?.user_name,
          avatar: `${imageUrl}/${CURRENT_CHAT?.chatPerson?.user_image}`,
        },
      });
    });
    // });
    // return () => {
    //   console.log('Socket Disconnected.');

    // };
  }, []);

  // useEffect(() => {
  //   if (isFocused === false) {
  //     setMessages([]);
  //     socketRef.disconnect();
  //     console.log('Socket disconnected');
  //   }
  // }, [isFocused]);
  // useEffect(() => {
  //   socketRef = io('http://webprojectmockup.com:9444');

  //   socketRef.emit('addUser', userId);
  // }, [userId]);

  // const getDuplicates = key => {
  //   const keys = messages.map(item => item[key]);
  //   return keys.filter(key => keys.indexOf(key) !== keys.lastIndexOf(key));
  // };

  // useEffect(async () => {
  //   if (isFocused && conversationId !== null && conversationId !== undefined) {
  //     await getMessages(conversationId);
  //   }
  // }, [isFocused, conversationId]);
  // console.log(JSON.stringify(messages, null, 2));
  useEffect(async () => {
    if (
      isFocused &&
      userId !== null &&
      userId !== undefined &&
      chatPersonId !== undefined &&
      chatPersonId !== null
    ) {
      await getMessages(apiData, CURRENT_CHAT);
    }
    if (isFocused === false) {
      setMessages([]);
    }
  }, [isFocused]);

  useEffect(() => {
    setMessages(messagesReducer?.messages);
  }, [messagesReducer?.messages]);

  const handlesend = useCallback(async () => {
    const messageToBeSend = {
      receiver: chatPersonId,
      sender: userId,
      message: text,
    };
    console.log(messageToBeSend, 'message to send');
    setSaveText(text);
    console.log(messageToBeSend);
    await sendMessage(messageToBeSend, onSucces);

    // getMessages(apiData,CURRENT_CHAT);
  });

  useEffect(() => {
    if (id !== null) {
      console.log('text:   ', text);
      const messageToAppend = {
        _id: id,
        text: saveText,
        createdAt: new Date(),
        user: {
          _id: userId,
          avatar: require('../../Assets/Images/pic8.png'),
          name: userReducer?.data?.user_name,
        },
      };
      socketRef.emit('sendMessage', {
        receiverId: chatPersonId,
        senderId: userId,
        text: saveText,
        id: id,
      });
      console.log(messageToAppend, 'message To Append');
      setMessages(prev => [messageToAppend, ...prev]);
      // setText('');
      setId(null);
    }
  }, [id]);
  const onSucces = id => {
    console.log(id, '------');
    setId(id);
  };
  useEffect(() => {
    if (arrivalMessage) {
      setMessages(prev => [arrivalMessage, ...prev]);
    }
  }, [arrivalMessage]);
  // useEffect(() => {
  //   console.log(messages[messages.length - 1]?._id, 'last item id');
  //   console.log('messages new length: ', messages.length);
  // }, [messages]);
  return (
    <ImageBackground
      style={{...StyleSheet.absoluteFillObject}}
      source={require('../../Assets/Images/white-bg.jpeg')}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <GiftedChat
          keyboardShouldPersistTaps="always"
          onInputTextChanged={text => setText(text)}
          messages={messages}
          // onSend={messages => onSend(messages)}
          onSend={messages => {
            // console.log(messages);
            handlesend();
          }}
          // minInputToolbarHeight={70}
          // renderInputToolbar={props => {
          //   return (
          //     <InputToolbar
          //       {...props}
          //       primaryStyle={{backgroundColor: 'white'}}
          //       renderSend={props => (
          //         text?.length > 0 && <TouchableOpacity onPress={handlesend}
          //           style={{
          //             backgroundColor: themeRed,
          //             padding: 6,
          //             paddingHorizontal:width * 0.03,
          //             borderRadius: 5,
          //             alignSelf:'center'
          //           }}>
          //           <Text style={{color: 'white', fontSize: width * 0.04}}>
          //             Send
          //           </Text>
          //         </TouchableOpacity>
          //       )}
          //       containerStyle={{
          //         backgroundColor: 'white',
          //         borderTopColor: '#E8E8E8',
          //         borderTopWidth: 1,
          //         padding: 8,
          //         shadowColor: '#000',
          //         shadowOffset: {
          //           width: 0,
          //           height: 11,
          //         },
          //         shadowOpacity: 0.57,
          //         shadowRadius: 15.19,

          //         elevation: 23,
          //       }}
          //     />
          //   );
          // }}
          renderBubble={props => {
            return (
              <Bubble
                {...props}
                position={
                  props?.currentMessage?.user?._id == userId ? 'right' : 'left'
                }
                textStyle={{
                  right: {
                    color: 'white',
                    fontSize: width * 0.04,
                  },
                  left: {
                    fontSize: width * 0.04,
                  },
                }}
                wrapperStyle={{
                  right: {
                    color: 'white',
                    backgroundColor: themeRed,
                    marginRight: 5,
                    marginVertical: 5,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 7,
                    },
                    shadowOpacity: 0.41,
                    shadowRadius: 9.11,

                    elevation: 14,
                  },
                  left: {
                    color: 'white',
                    backgroundColor: 'white',
                    marginVertical: 5,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 7,
                    },
                    shadowOpacity: 0.41,
                    shadowRadius: 9.11,

                    elevation: 14,
                  },
                }}
              />
            );
          }}
          user={{
            _id: userId,
          }}
        />
        {/* <Image
        style={{...StyleSheet.absoluteFillObject}}
        source={require('../../Assets/Images/bg.png')}
      /> */}
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const mapStateToProps = ({messagesReducer, userReducer}) => {
  return {messagesReducer, userReducer};
};
export default connect(mapStateToProps, actions)(Chat);
